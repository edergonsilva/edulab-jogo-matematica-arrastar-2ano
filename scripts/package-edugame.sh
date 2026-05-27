set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
DEFAULT_FILE="$DIST_DIR/arrasta-matematica-2ano.edugame"
OUTPUT_FILE="${1:-$DEFAULT_FILE}"

if [[ "$OUTPUT_FILE" = /* ]]; then
  TARGET_FILE="$OUTPUT_FILE"
else
  TARGET_FILE="$ROOT_DIR/$OUTPUT_FILE"
fi

mkdir -p "$(dirname "$TARGET_FILE")"
rm -f "$TARGET_FILE"

cd "$ROOT_DIR"
zip -r "$TARGET_FILE" manifest.json index.html assets README.md >/dev/null

echo "Pacote gerado em: $TARGET_FILE"