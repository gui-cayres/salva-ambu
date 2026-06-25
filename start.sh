#!/usr/bin/env bash
# Iniciador para Linux / macOS

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  Prontuário IA — Salvador de Ambu"
echo "  ──────────────────────────────────"

if command -v python3 &>/dev/null; then
    echo "  [OK] Python3 encontrado. Iniciando servidor..."
    python3 "$DIR/server.py"
elif command -v python &>/dev/null; then
    echo "  [OK] Python encontrado. Iniciando servidor..."
    python "$DIR/server.py"
else
    echo "  [!!] Python não encontrado. Abrindo arquivo diretamente..."
    if command -v xdg-open &>/dev/null; then
        xdg-open "$DIR/index.html"
    else
        open "$DIR/index.html"
    fi
fi
