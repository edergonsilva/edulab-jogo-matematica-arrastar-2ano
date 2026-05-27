#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_FILE="${1:-arrasta-matematica-2ano-v1.edugame}"

if [[ "$OUTPUT_FILE" = /* ]]; then
  TARGET_FILE="$OUTPUT_FILE"
else
  TARGET_FILE="$ROOT_DIR/$OUTPUT_FILE"
fi

cd "$ROOT_DIR"
rm -f "$TARGET_FILE"
zip -r "$TARGET_FILE" manifest.json index.html assets README.md >/dev/null

echo "Pacote gerado: $TARGET_FILE"
