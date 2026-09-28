#!/bin/sh
# Installs `hire` into /usr/local/bin so `sudo hire salman` works.
#   curl -fsSL https://salman-ch.netlify.app/install.sh | sh
set -eu
SRC="https://salman-ch.netlify.app/hire.sh"
DEST="/usr/local/bin/hire"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

if command -v curl >/dev/null 2>&1; then curl -fsSL "$SRC" -o "$TMP"
elif command -v wget >/dev/null 2>&1; then wget -qO "$TMP" "$SRC"
else echo "need curl or wget" >&2; exit 1
fi

head -n1 "$TMP" | grep -q '^#!/bin/sh' || { echo "download looked wrong, aborting" >&2; exit 1; }
chmod 755 "$TMP"

if [ -w "$(dirname "$DEST")" ]; then mv "$TMP" "$DEST"
else echo "installing to $DEST (needs sudo)"; sudo mv "$TMP" "$DEST"
fi
trap - EXIT

echo "installed. now run:  sudo hire salman"
