# Configuração para Produção - Prontuario IA

Este documento descreve como configurar o servidor `server.py` para ambiente de produção.

## Variáveis de Ambiente

O servidor agora suporta variáveis de ambiente para configuração segura em produção.

### Variáveis Principais

1. **API_KEY** (obrigatória)
   - Chave da API do provedor selecionado
   - Exemplo: `sk-ant-...` (Anthropic), `sk-...` (OpenAI)

2. **API_PROVIDER** (opcional, padrão: `anthropic`)
   - Provedor de IA a ser utilizado
   - Valores suportados: `anthropic`, `openai`, `groq`, `openrouter`, `deepseek`

3. **API_MODEL** (opcional)
   - Modelo específico a ser utilizado
   - Se não especificado, usa o modelo padrão do provedor

4. **ALLOWED_ORIGINS** (opcional, padrão: `*` para desenvolvimento)
   - Lista de origens permitidas para CORS (separadas por vírgula)
   - Exemplo para produção: `https://seusite.com,https://app.seusite.com`
   - Exemplo para desenvolvimento: `*` (permite todas as origens)

### Exemplos de Configuração

#### Linux/macOS (bash)
```bash
export API_KEY="sk-ant-sua-chave-aqui"
export API_PROVIDER="anthropic"
export API_MODEL="claude-haiku-4-5-20251001"
export ALLOWED_ORIGINS="https://seusite.com"
python server.py
```

#### Windows (PowerShell)
```powershell
$env:API_KEY="sk-ant-sua-chave-aqui"
$env:API_PROVIDER="anthropic"
$env:API_MODEL="claude-haiku-4-5-20251001"
$env:ALLOWED_ORIGINS="https://seusite.com"
python server.py
```

#### Docker
```dockerfile
FROM python:3.9-slim
COPY . /app
WORKDIR /app
ENV API_KEY="sk-ant-sua-chave-aqui"
ENV API_PROVIDER="anthropic"
ENV ALLOWED_ORIGINS="https://seusite.com"
EXPOSE 8080
CMD ["python", "server.py"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  prontuario-ia:
    build: .
    ports:
      - "8080:8080"
    environment:
      - API_KEY=${API_KEY}
      - API_PROVIDER=${API_PROVIDER}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    restart: unless-stopped
```

## Prioridade de Configuração

O servidor segue esta ordem de prioridade para obter configurações:

1. **Variáveis de ambiente** (recomendado para produção)
2. **Arquivo `api_config.txt`** (fallback para desenvolvimento)
3. **Arquivo `api_key.txt`** (legado, compatibilidade retroativa)

## Endpoints Adicionados

### Health Check
- **GET** `/api/health`
- Retorna: `{"status": "ok", "timestamp": ..., "service": "Prontuario IA", "version": "1.0.0"}`
- Útil para monitoramento e load balancers

### Status (existente)
- **GET** `/api/status`
- Retorna: `{"status": "online", "timestamp": ...}`

## Logging

O servidor agora usa o módulo `logging` do Python com as seguintes características:

- **Nível**: INFO (pode ser alterado via variável de ambiente `LOG_LEVEL`)
- **Formato**: `YYYY-MM-DD HH:MM:SS - LEVEL - mensagem`
- **Arquivo**: Logs são enviados para stdout/stderr
- **Conteúdo**:
  - Inicialização do servidor
  - Requisições recebidas (método, path, IP)
  - Erros de API
  - Health checks
  - Avisos de segurança (CORS, tamanho de requisição)

## Segurança

### CORS (Cross-Origin Resource Sharing)
- Em produção: Configure `ALLOWED_ORIGINS` com as URLs específicas do seu frontend
- Em desenvolvimento: Use `*` (permite todas as origens)
- Headers CORS são adicionados automaticamente

### Content Security Policy (CSP)
- Política restritiva para prevenir XSS e ataques de injeção
- Configurada no header `Content-Security-Policy`

### Validação de Input
- Sanitização de texto para prevenir XSS
- Limites de tamanho para prompts e prontuários
- Validação de tipos de arquivo

## Deployment

### Como um serviço systemd (Linux)
```ini
# /etc/systemd/system/prontuario-ia.service
[Unit]
Description=Prontuario IA Server
After=network.target

[Service]
Type=simple
User=prontuario
WorkingDirectory=/opt/prontuario-ia
Environment="API_KEY=sk-ant-sua-chave-aqui"
Environment="ALLOWED_ORIGINS=https://seusite.com"
ExecStart=/usr/bin/python3 server.py
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### PM2 (Node.js process manager)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar com variáveis de ambiente
API_KEY="sk-ant-sua-chave-aqui" ALLOWED_ORIGINS="https://seusite.com" pm2 start server.py --name "prontuario-ia" --interpreter python3

# Salvar configuração
pm2 save
pm2 startup
```

## Monitoramento

### Health Checks
```bash
# Verificar se o servidor está respondendo
curl http://localhost:8080/api/health

# Verificar status básico
curl http://localhost:8080/api/status
```

### Logs
- Os logs são enviados para stdout/stderr
- Em produção, configure um sistema de coleta de logs (ELK, CloudWatch, etc.)
- Nível de log pode ser ajustado via código se necessário

## Troubleshooting

### Porta já em uso
```bash
# Verificar processo usando a porta 8080
sudo lsof -i :8080

# Matar processo (se necessário)
sudo kill -9 <PID>
```

### Erros de CORS
- Verifique se `ALLOWED_ORIGINS` está configurada corretamente
- Em desenvolvimento, use `*` temporariamente
- Verifique logs para ver origens bloqueadas

### Erros de API
- Verifique se `API_KEY` está configurada e é válida
- Verifique logs para mensagens de erro específicas do provedor
- Teste a chave diretamente com o provedor se necessário