# Dockerfile para SalvaAmbuDS - Gerador de Prontuário Médico com IA
# Versão: 2.0
# Data: 2026-04-15

# Usar imagem oficial do Python 3.8
FROM python:3.8-slim

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema (se necessário)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de requisitos primeiro (para melhor cache)
COPY requirements.txt .

# Instalar dependências Python
# Nota: O servidor usa http.server (biblioteca padrão),
# mas mantemos flask e requests para compatibilidade futura
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todos os arquivos do projeto
COPY . .

# Criar diretório para histórico de prontuários
RUN mkdir -p historico_prontuarios

# Ajustar porta do servidor de 8080 para 5000
RUN python -c "import re; data = open('server.py').read(); data = re.sub(r'PORT = 8080', 'PORT = 5000', data); open('server.py', 'w').write(data)"

# Expor porta 5000 (conforme solicitado)
EXPOSE 5000

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1
ENV LOG_LEVEL=INFO

# Comando para iniciar o servidor
CMD ["python", "server.py"]