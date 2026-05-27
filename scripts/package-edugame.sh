#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_PATH="$DIST_DIR/arrasta-matematica-2ano.edugame"

mkdir -p "$DIST_DIR"
rm -f "$PACKAGE_PATH"

cd "$ROOT_DIR"
zip -r "$PACKAGE_PATH" manifest.json index.html README.md >/dev/null

echo "Pacote gerado em: $PACKAGE_PATH"
