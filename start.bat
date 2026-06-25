@echo off
chcp 65001 > nul
title Prontuario IA — Salvador de Ambu

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║    PRONTUÁRIO IA — Salvador de Ambu      ║
echo  ║    Gerador local de prontuário SOAP      ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Tenta Python 3
python --version > nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python encontrado. Iniciando servidor local...
    echo  [..] Acesse: http://localhost:8080/index.html
    echo.
    echo  Feche esta janela para ENCERRAR o servidor.
    echo.
    python "%~dp0server.py"
    goto FIM
)

:: Tenta python3 explicitamente
python3 --version > nul 2>&1
if %errorlevel% == 0 (
    echo  [OK] Python3 encontrado. Iniciando servidor local...
    python3 "%~dp0server.py"
    goto FIM
)

:: Fallback: abre o arquivo diretamente
echo  [!!] Python nao encontrado.
echo  [..] Abrindo o arquivo diretamente no navegador...
echo.
echo  ATENCAO: Sem o servidor Python, o modelo de IA pode
echo  nao carregar corretamente em alguns navegadores.
echo  Para melhor desempenho, instale o Python 3:
echo  https://www.python.org/downloads/
echo.
start "" "%~dp0index.html"

:FIM
pause
