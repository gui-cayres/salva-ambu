# SalvaAmbuDS — Gerador de Prontuário Médico com IA

Sistema local para geração automatizada de prontuários médicos no formato SOAP (Subjective, Objective, Assessment, Plan) utilizando inteligência artificial.

## 🚀 Instalação Rápida

### Pré-requisitos
- Python 3.8 ou superior
- Conexão com internet para acessar modelos de IA

### Passos de instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone https://github.com/seu-usuario/SalvaAmbuDS.git
   cd SalvaAmbuDS
   ```

2. **Instale as dependências**
   ```bash
   pip install requests
   ```

3. **Configure sua chave de IA**
   - Abra o arquivo `api_config.txt`
   - Escolha um provedor (deepseek, anthropic, openai, groq, openrouter)
   - Insira sua chave de API no campo `key=`
   - Salve o arquivo

4. **Execute o sistema**
   - **Windows**: Clique duas vezes em `start.bat`
   - **Linux/Mac**: Execute `./start.sh` (ou `python server.py`)

5. **Acesse no navegador**
   - Abra `http://localhost:8080/index.html`
   - Ou clique no link que aparece no terminal

## ⚙️ Configuração da API de IA

Edite o arquivo `api_config.txt` para escolher seu provedor preferido:

```ini
# Provedores suportados:
#   deepseek    → Gratuito e rápido (recomendado)
#   anthropic   → Claude (pago)
#   openai      → ChatGPT (pago)
#   groq        → Gratuito e rápido
#   openrouter  → Acesso a dezenas de modelos

provider=deepseek
key=sua_chave_aqui
model=deepseek-chat
```

**Provedores gratuitos recomendados:**
- **DeepSeek**: Crie conta em https://platform.deepseek.com
- **Groq**: Crie conta em https://console.groq.com

## ⌨️ Atalhos Principais

### Teclas de atalho
- `Ctrl + Enter` → Gerar prontuário completo
- `Ctrl + S` → Salvar prontuário atual
- `Ctrl + L` → Carregar histórico
- `Ctrl + D` → Limpar formulário
- `Ctrl + H` → Alternar painel lateral
- `Ctrl + P` → Imprimir prontuário
- `Ctrl + E` → Exportar como PDF

### Navegação rápida
- Use `Tab` para navegar entre campos
- `Shift + Tab` para voltar
- `Esc` para fejar diálogos
- `F1` para abrir manual

## 🏥 Como usar

1. **Preencha os dados do paciente**
   - Nome, idade, sexo, queixa principal

2. **Adicione informações clínicas**
   - Medicamentos, exames solicitados, achados do exame físico

3. **Clique em "Gerar Prontuário"**
   - O sistema usará IA para criar um prontuário SOAP completo

4. **Revise e edite**
   - Ajuste o texto gerado conforme necessário

5. **Salve ou exporte**
   - Salve localmente ou exporte como PDF/HTML

## 🐳 Execução com Docker

```bash
# Construir a imagem
docker build -t salvambuds .

# Executar o container
docker run -p 5000:5000 salvambuds

# Acessar no navegador
http://localhost:5000
```

## 📁 Estrutura do projeto

```
SalvaAmbuDS/
├── index.html          # Interface principal
├── server.py           # Servidor Python
├── api_config.txt      # Configuração da API
├── start.bat           # Inicializador Windows
├── start.sh            # Inicializador Linux/Mac
├── README.md           # Este arquivo
├── MANUAL.md           # Manual técnico completo
└── Dockerfile          # Configuração Docker
```

## 🔧 Solução de problemas

**"Python não encontrado"**
- Instale Python 3.8+ em https://python.org
- Verifique se `python --version` funciona no terminal

**"Erro de conexão com API"**
- Verifique sua chave em `api_config.txt`
- Confira se o provedor está correto
- Teste sua conexão com internet

**"Servidor não inicia"**
- Feche outras aplicações na porta 8080
- Execute como administrador se necessário

## 📞 Suporte

- Consulte o `MANUAL.md` para detalhes técnicos
- Reporte problemas no repositório do projeto
- Para dúvidas médicas, consulte um profissional qualificado

---

**Versão**: 2.0 • **Data**: 2026-04-15  
**Licença**: Uso livre para fins médicos e educacionais  
**Aviso**: Sistema auxiliar — sempre valide com profissional de saúde