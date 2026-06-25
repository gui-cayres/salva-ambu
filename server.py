"""
Servidor local para o Prontuário IA.
Faz proxy das chamadas à API de IA configurada em api_config.txt.
Uso: python server.py
"""

import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
import webbrowser
import threading
import time
import logging

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Configuração de logging
log_level_env = os.environ.get('LOG_LEVEL', 'INFO').upper()
log_level = getattr(logging, log_level_env, logging.INFO)

logging.basicConfig(
    level=log_level,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def get_allowed_origins():
    """Determina as origens permitidas para CORS.
    Prioridade: 1. Variável de ambiente ALLOWED_ORIGINS, 2. '*' para desenvolvimento.
    """
    allowed_origins_env = os.environ.get('ALLOWED_ORIGINS', '').strip()

    if allowed_origins_env:
        # Separar múltiplas origens por vírgula
        origins = [origin.strip() for origin in allowed_origins_env.split(',') if origin.strip()]
        logger.info(f"CORS configurado para origens específicas: {origins}")
        return origins
    else:
        # Modo desenvolvimento - permitir todas as origens
        logger.info("CORS configurado para todas as origens (modo desenvolvimento)")
        return ['*']

# Padrões por provedor
_DEFAULTS = {
    'anthropic':  {'url': 'https://api.anthropic.com/v1/messages',              'model': 'claude-haiku-4-5-20251001'},
    'openai':     {'url': 'https://api.openai.com/v1/chat/completions',          'model': 'gpt-4o-mini'},
    'groq':       {'url': 'https://api.groq.com/openai/v1/chat/completions',     'model': 'llama-3.3-70b-versatile'},
    'openrouter': {'url': 'https://openrouter.ai/api/v1/chat/completions',       'model': 'openai/gpt-4o-mini'},
    'deepseek':   {'url': 'https://api.deepseek.com/v1/chat/completions',        'model': 'deepseek-chat'},
}


def ler_config():
    """Lê configuração da API com suporte a variáveis de ambiente.
    Prioridade: 1. Variáveis de ambiente, 2. api_config.txt, 3. api_key.txt (legado)
    """
    # Primeiro, tentar obter da variável de ambiente API_KEY
    api_key_env = os.environ.get('API_KEY', '').strip()
    provider_env = os.environ.get('API_PROVIDER', '').strip()
    model_env = os.environ.get('API_MODEL', '').strip()

    # Se temos pelo menos a chave da API via ambiente, usar isso
    if api_key_env and api_key_env not in ('SUA-CHAVE-AQUI', 'sk-ant-SUA-CHAVE-AQUI'):
        cfg = {
            'key': api_key_env,
            'provider': provider_env or 'anthropic',
            'model': model_env
        }
        # Log de uso de variável de ambiente (sem incluir a chave real)
        logger.info(f"Usando configuração de variáveis de ambiente (provider: {cfg['provider']})")
        return cfg

    # Fallback para arquivo de configuração
    cfg_path = os.path.join(DIRECTORY, 'api_config.txt')
    old_path = os.path.join(DIRECTORY, 'api_key.txt')

    if os.path.exists(cfg_path):
        cfg = {}
        with open(cfg_path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    cfg[k.strip()] = v.strip()
        logger.info(f"Usando configuração de arquivo: {cfg_path}")
        return cfg

    if os.path.exists(old_path):          # retrocompatibilidade
        with open(old_path, encoding='utf-8') as f:
            cfg = {'provider': 'anthropic', 'key': f.read().strip(), 'model': ''}
        logger.info(f"Usando configuração legada: {old_path}")
        return cfg

    return {'erro': 'Arquivo api_config.txt não encontrado na pasta do app e API_KEY não configurada.'}


class ProntuarioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Headers CORS
        origin = self.headers.get('Origin', '')
        allowed_origins = get_allowed_origins()

        if allowed_origins == ['*']:
            # Modo desenvolvimento - permitir qualquer origem
            self.send_header('Access-Control-Allow-Origin', '*')
        elif origin in allowed_origins:
            # Modo produção - permitir apenas origens específicas
            self.send_header('Access-Control-Allow-Origin', origin)
        elif allowed_origins and origin:
            # Origem não permitida
            logger.warning(f"Origem não permitida para CORS: {origin}")

        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Credentials', 'true')

        # Headers de segurança
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')

        # Cache-control: no-cache para arquivos JS e JSON
        path = getattr(self, 'path', '')
        if path.endswith('.js') or path.endswith('.json'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')

        # Content Security Policy para prevenir XSS e ataques de injeção
        csp = (
            "default-src 'self'; "
            # unsafe-inline: scripts inline no HTML
            # unsafe-eval: necessário para o Tailwind CDN compilar estilos JIT com new Function()
            # cdn.tailwindcss.com: carregamento do script do Tailwind
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; "
            # unsafe-inline necessário para estilos inline; fonts.googleapis.com para Google Fonts CSS
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "img-src 'self' data:; "
            # fonts.gstatic.com para os arquivos de fonte do Google Fonts
            "font-src 'self' https://fonts.gstatic.com; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "form-action 'self'; "
            "base-uri 'self'; "
            "object-src 'none'; "
            "media-src 'self'; "
            "worker-src 'self'; "
            "manifest-src 'self'"
        )
        self.send_header('Content-Security-Policy', csp)
        super().end_headers()

    def _validar_tamanho_texto(self, texto, max_caracteres=10000, campo="texto"):
        """Valida tamanho do texto e retorna erro se exceder limite"""
        if len(texto) > max_caracteres:
            raise ValueError(f"{campo} muito longo ({len(texto)} caracteres). Máximo permitido: {max_caracteres}")
        return True

    def _sanitizar_texto(self, texto):
        """Remove caracteres perigosos para prevenir XSS"""
        if not isinstance(texto, str):
            return texto

        # Substituir caracteres HTML perigosos
        sanitizado = texto
        substituicoes = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        }

        for char, replacement in substituicoes.items():
            sanitizado = sanitizado.replace(char, replacement)

        return sanitizado

    def do_GET(self):
        client_ip = self.client_address[0]
        logger.info(f"GET {self.path} de {client_ip}")

        if self.path == '/api/status':
            self._json_ok({'status': 'online', 'timestamp': time.time()})
        elif self.path == '/api/health':
            self._handle_health()
        elif self.path == '/api/historico':
            self._handle_historico()
        elif self.path.startswith('/api/templates'):
            self._handle_templates()
        elif self.path == '/':
            self.path = '/index.html'
            return super().do_GET()
        else:
            super().do_GET()

    def do_OPTIONS(self):
        """Lida com requisições preflight do CORS"""
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        client_ip = self.client_address[0]
        logger.info(f"POST {self.path} de {client_ip}")

        if self.path == '/api/gerar':
            self._handle_gerar()
        elif self.path == '/api/salvar':
            self._handle_salvar()
        elif self.path == '/api/limpar':
            self._handle_limpar()
        else:
            logger.warning(f"Endpoint não encontrado: {self.path}")
            self.send_error(404)

    def _handle_gerar(self):
        cfg = ler_config()
        if 'erro' in cfg:
            logger.error(f"Erro de configuração: {cfg['erro']}")
            self._json_error(500, cfg['erro'])
            return

        provider = cfg.get('provider', 'anthropic').lower().strip()
        api_key  = cfg.get('key', '').strip()
        model    = cfg.get('model', '').strip()

        if not api_key or api_key in ('SUA-CHAVE-AQUI', 'sk-ant-SUA-CHAVE-AQUI'):
            logger.error("Chave da API não configurada")
            self._json_error(500, 'Configure sua chave no arquivo api_config.txt (campo key=).')
            return

        if provider not in _DEFAULTS:
            logger.error(f"Provedor não reconhecido: {provider}")
            self._json_error(500, f'Provedor "{provider}" não reconhecido. Use: anthropic, openai, groq, openrouter ou deepseek.')
            return

        length = int(self.headers.get('Content-Length', 0))

        # Validar tamanho da requisição (máximo 1MB)
        if length > 1024 * 1024:
            self._json_error(413, 'Requisição muito grande. Máximo permitido: 1MB')
            return

        body   = json.loads(self.rfile.read(length).decode('utf-8', errors='replace'))
        prompt = body.get('prompt', '').strip()
        if not prompt:
            self._json_error(400, 'Prompt vazio.')
            return

        # Validar tamanho do prompt (máximo 30.000 caracteres)
        try:
            self._validar_tamanho_texto(prompt, max_caracteres=30000, campo="Prompt")
        except ValueError as e:
            self._json_error(400, str(e))
            return

        url   = _DEFAULTS[provider]['url']
        model = model or _DEFAULTS[provider]['model']

        if provider == 'anthropic':
            self._chamar_anthropic(api_key, model, url, prompt)
        elif provider == 'deepseek':
            self._chamar_deepseek(api_key, model, url, prompt)
        elif provider == 'openai':
            self._chamar_openai(api_key, model, url, prompt)
        elif provider == 'groq':
            self._chamar_groq(api_key, model, url, prompt)
        elif provider == 'openrouter':
            self._chamar_openrouter(api_key, model, url, prompt)
        else:
            self._json_error(500, f'Provedor "{provider}" não implementado.')

    # ── Anthropic ────────────────────────────────────────────
    def _chamar_anthropic(self, key, model, url, prompt):
        payload = json.dumps({
            'model': model,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={
            'anthropic-version': '2023-06-01',
            'x-api-key': key,
            'content-type': 'application/json',
        })
        self._executar(req, lambda r: r['content'][0]['text'])

    # ── DeepSeek ─────────────────────────────────────────────
    def _chamar_deepseek(self, key, model, url, prompt):
        payload = json.dumps({
            'model': model,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={
            'Authorization': f'Bearer {key}',
            'content-type': 'application/json',
        })
        self._executar(req, lambda r: r['choices'][0]['message']['content'])

    # ── OpenAI ───────────────────────────────────────────────
    def _chamar_openai(self, key, model, url, prompt):
        payload = json.dumps({
            'model': model,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={
            'Authorization': f'Bearer {key}',
            'content-type': 'application/json',
        })
        self._executar(req, lambda r: r['choices'][0]['message']['content'])

    # ── Groq ─────────────────────────────────────────────────
    def _chamar_groq(self, key, model, url, prompt):
        payload = json.dumps({
            'model': model,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={
            'Authorization': f'Bearer {key}',
            'content-type': 'application/json',
        })
        self._executar(req, lambda r: r['choices'][0]['message']['content'])

    # ── OpenRouter ───────────────────────────────────────────
    def _chamar_openrouter(self, key, model, url, prompt):
        payload = json.dumps({
            'model': model,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': prompt}],
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers={
            'Authorization': f'Bearer {key}',
            'content-type': 'application/json',
            'HTTP-Referer': 'http://localhost:8080',
            'X-Title': 'Prontuario IA',
        })
        self._executar(req, lambda r: r['choices'][0]['message']['content'])

    def _executar(self, req, extrair):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                resultado = json.loads(resp.read().decode('utf-8', errors='replace'))
                logger.info(f"API chamada com sucesso, status: {resp.status}")
                self._json_ok({'texto': extrair(resultado)})
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8', errors='replace')
            # Extrair URL da requisição para identificar o provedor
            url = req.full_url if hasattr(req, 'full_url') else (req.get_full_url() if hasattr(req, 'get_full_url') else str(req))
            error_msg = self._tratar_erro_api(e.code, msg, url)
            logger.error(f"Erro HTTP da API: {e.code} - {error_msg}")
            self._json_error(500, error_msg)
        except urllib.error.URLError as e:
            logger.error(f"Erro de conexão com a API: {e.reason}")
            self._json_error(500, f'Sem conexão com a API: {e.reason}')
        except Exception as e:
            logger.error(f"Erro inesperado na API: {str(e)}")
            self._json_error(500, str(e))

    def _tratar_erro_api(self, code, msg, url):
        """Tratamento específico de erros por provedor"""
        try:
            error_data = json.loads(msg) if msg else {}
        except:
            error_data = {}

        # Identificar provedor pela URL
        url_lower = url.lower()

        # Erros comuns
        if code == 401:
            if 'anthropic' in url_lower:
                return 'Chave da API Anthropic inválida ou expirada. Verifique sua chave em api_config.txt.'
            elif 'openrouter' in url_lower:
                return 'Chave da API OpenRouter inválida. Verifique sua chave em api_config.txt.'
            elif 'deepseek' in url_lower:
                return 'Chave da API DeepSeek inválida. Verifique sua chave em api_config.txt.'
            elif 'openai' in url_lower or 'groq' in url_lower:
                return 'Chave da API inválida ou expirada. Verifique sua chave em api_config.txt.'
            else:
                return 'Chave da API inválida ou expirada. Verifique sua chave em api_config.txt.'

        elif code == 429:
            if 'anthropic' in url_lower:
                return 'Rate limit excedido na Anthropic. Aguarde alguns minutos antes de tentar novamente.'
            elif 'openai' in url_lower:
                return 'Rate limit excedido na OpenAI. Aguarde alguns minutos ou verifique seu plano.'
            elif 'groq' in url_lower:
                return 'Rate limit excedido no Groq. Limite de requisições por minuto atingido.'
            elif 'openrouter' in url_lower:
                return 'Rate limit excedido no OpenRouter. Verifique seus créditos ou plano.'
            elif 'deepseek' in url_lower:
                return 'Rate limit excedido no DeepSeek. Aguarde alguns minutos.'
            else:
                return 'Rate limit excedido. Aguarde alguns minutos antes de tentar novamente.'

        elif code == 400:
            error_type = error_data.get('error', {}).get('type', '') if isinstance(error_data.get('error'), dict) else ''
            error_message = error_data.get('error', {}).get('message', '') if isinstance(error_data.get('error'), dict) else ''

            if 'invalid_request_error' in str(error_type).lower():
                if 'model' in str(error_message).lower():
                    return f'Modelo não encontrado ou indisponível. Verifique o nome do modelo em api_config.txt.'
                elif 'prompt' in str(error_message).lower():
                    return 'Prompt inválido ou muito longo.'

            return f'Requisição inválida: {error_message or msg[:200]}'

        elif code == 404:
            return 'Endpoint da API não encontrado. Verifique se o provedor está configurado corretamente.'

        elif code == 500 or code == 502 or code == 503 or code == 504:
            return f'Erro interno do provedor ({code}). Tente novamente em alguns instantes.'

        # Mensagem genérica com código
        return f'Erro da API ({code}): {msg[:300] if len(msg) > 300 else msg}'

    def _handle_salvar(self):
        """Salva prontuário no histórico local"""
        try:
            length = int(self.headers.get('Content-Length', 0))

            # Validar tamanho da requisição (máximo 5MB para prontuários completos)
            if length > 5 * 1024 * 1024:
                logger.warning(f"Requisição muito grande para salvar: {length} bytes")
                self._json_error(413, 'Prontuário muito grande. Máximo permitido: 5MB')
                return

            body = json.loads(self.rfile.read(length).decode('utf-8', errors='replace'))
            texto = body.get('texto', '')

            # Validar tamanho do texto (máximo 50.000 caracteres para prontuário)
            try:
                self._validar_tamanho_texto(texto, max_caracteres=50000, campo="Texto do prontuário")
            except ValueError as e:
                logger.warning(f"Texto muito longo para salvar: {len(texto)} caracteres")
                self._json_error(400, str(e))
                return

            # Criar pasta historico_prontuarios se não existir
            historico_dir = os.path.join(DIRECTORY, 'historico_prontuarios')
            os.makedirs(historico_dir, exist_ok=True)

            # Gerar nome de arquivo único
            timestamp = int(time.time())
            filename = f"prontuario_{timestamp}.txt"
            filepath = os.path.join(historico_dir, filename)

            # Salvar como arquivo de texto
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(texto)

            logger.info(f"Prontuário salvo: {filename} ({len(texto)} caracteres)")
            self._json_ok({
                'id': timestamp,
                'filename': filename,
                'message': 'Prontuário salvo com sucesso'
            })

        except Exception as e:
            logger.error(f"Erro ao salvar prontuário: {str(e)}")
            self._json_error(500, f'Erro ao salvar prontuário: {str(e)}')

    def _handle_historico(self):
        """Lista prontuários salvos"""
        try:
            historico_dir = os.path.join(DIRECTORY, 'historico_prontuarios')
            if not os.path.exists(historico_dir):
                self._json_ok([])
                return

            files = []
            for filename in os.listdir(historico_dir):
                if filename.endswith('.txt'):
                    filepath = os.path.join(historico_dir, filename)
                    stat = os.stat(filepath)
                    files.append({
                        'id': filename.replace('prontuario_', '').replace('.txt', ''),
                        'filename': filename,
                        'size': stat.st_size,
                        'modified': stat.st_mtime
                    })

            # Ordenar por data de modificação (mais recente primeiro)
            files.sort(key=lambda x: x['modified'], reverse=True)
            self._json_ok(files)

        except Exception as e:
            self._json_error(500, f'Erro ao listar histórico: {str(e)}')

    def _handle_templates(self):
        """Retorna templates disponíveis"""
        try:
            # Verificar se há parâmetro de especialidade
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(self.path)
            query = parse_qs(parsed.query)
            especialidade = query.get('especialidade', [None])[0]

            # Carregar templates.json
            templates_path = os.path.join(DIRECTORY, 'data', 'templates.json')
            if os.path.exists(templates_path):
                with open(templates_path, 'r', encoding='utf-8') as f:
                    templates = json.load(f)

                # Filtrar por especialidade se especificado
                if especialidade:
                    filtered = {}
                    for key, template in templates.items():
                        if template.get('especialidade') == especialidade or template.get('especialidade') == 'geral':
                            filtered[key] = template
                    self._json_ok(filtered)
                else:
                    self._json_ok(templates)
            else:
                self._json_ok({})

        except Exception as e:
            self._json_error(500, f'Erro ao carregar templates: {str(e)}')

    def _handle_health(self):
        """Endpoint de health check para monitoramento"""
        try:
            health_data = {
                'status': 'ok',
                'timestamp': time.time(),
                'service': 'Prontuario IA',
                'version': '1.0.0'
            }
            logger.info(f"Health check solicitado de {self.client_address[0]}")
            self._json_ok(health_data)
        except Exception as e:
            logger.error(f"Erro no health check: {str(e)}")
            self._json_error(500, f'Erro interno no health check: {str(e)}')

    def _handle_limpar(self):
        """Limpa histórico de prontuários"""
        try:
            historico_dir = os.path.join(DIRECTORY, 'historico_prontuarios')
            if os.path.exists(historico_dir):
                for filename in os.listdir(historico_dir):
                    # Validar que é um arquivo .txt e prevenir path traversal
                    if filename.endswith('.txt') and filename.startswith('prontuario_'):
                        filepath = os.path.join(historico_dir, filename)
                        # Verificar se o caminho está dentro do diretório permitido
                        if os.path.commonpath([filepath, historico_dir]) == historico_dir:
                            os.remove(filepath)
                self._json_ok({'message': 'Histórico limpo com sucesso'})
            else:
                self._json_ok({'message': 'Nenhum histórico para limpar'})

        except Exception as e:
            self._json_error(500, f'Erro ao limpar histórico: {str(e)}')

    def _json_ok(self, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json_error(self, code, msg):
        body = json.dumps({'erro': msg}).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        # Este método é chamado automaticamente pelo SimpleHTTPRequestHandler
        # Vamos usar nosso logger em vez do print padrão
        status_code = args[1] if len(args) > 1 else '?'
        message = args[0] if len(args) > 0 else ''

        # Filtrar logs de sucesso (200, 304) para reduzir ruído
        if status_code in ('200', '304'):
            return

        # Logar apenas erros e requisições problemáticas
        if status_code.startswith('4') or status_code.startswith('5'):
            logger.warning(f"HTTP {status_code}: {message} de {self.client_address[0]}")
        else:
            logger.info(f"HTTP {status_code}: {message} de {self.client_address[0]}")


def abrir_navegador():
    import time
    time.sleep(1.2)
    webbrowser.open(f'http://localhost:{PORT}/index.html')


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    cfg = ler_config()
    provider = cfg.get('provider', '?')
    model    = cfg.get('model', '') or _DEFAULTS.get(provider, {}).get('model', '?')

    # Log de inicialização
    logger.info("=" * 50)
    logger.info("Iniciando Prontuario IA - Servidor local")
    logger.info(f"URL: http://localhost:{PORT}/index.html")
    logger.info(f"Provedor: {provider}")
    logger.info(f"Modelo: {model}")
    logger.info(f"Diretório: {DIRECTORY}")
    logger.info(f"Nível de log: {log_level_env}")
    logger.info("=" * 50)

    try:
        with socketserver.TCPServer(('', PORT), ProntuarioHandler) as httpd:
            print(f'\n  Prontuario IA - Servidor local')
            print(f'  ------------------------------')
            print(f'  URL      : http://localhost:{PORT}/index.html')
            print(f'  Provedor : {provider}')
            print(f'  Modelo   : {model}')
            print(f'\n  Abrindo navegador...')
            print(f'  (Ctrl+C para encerrar)\n')
            threading.Thread(target=abrir_navegador, daemon=True).start()
            httpd.serve_forever()
    except OSError as e:
        if 'Address already in use' in str(e) or '10048' in str(e):
            logger.error(f"Porta {PORT} já em uso")
            print(f'\n  Porta {PORT} já em uso. Abrindo navegador mesmo assim...')
            webbrowser.open(f'http://localhost:{PORT}/index.html')
        else:
            logger.error(f"Erro ao iniciar servidor: {str(e)}")
            raise
    except KeyboardInterrupt:
        logger.info("Servidor encerrado pelo usuário")
        print('\n\n  Servidor encerrado.')
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        raise
