#!/bin/sh
# hire: a tiny CLI business card for Muhammad Salman.
#
#   sudo hire salman     the intended way
#   hire salman          works without sudo too
#   hire --help
#
# Install:  curl -fsSL https://salman-ch.netlify.app/install.sh | sh
# Remove:   sudo rm /usr/local/bin/hire
set -eu

EMAIL="chsalmanramzan422@gmail.com"
SITE="https://salman-ch.netlify.app"
SUBJECT="Let%E2%80%99s%20talk"

if [ -t 1 ]; then
  B=$(printf '\033[1m'); D=$(printf '\033[2m'); R=$(printf '\033[0m')
  T=$(printf '\033[36m'); G=$(printf '\033[32m'); Y=$(printf '\033[33m'); M=$(printf '\033[35m')
else
  B=''; D=''; R=''; T=''; G=''; Y=''; M=''
fi

usage() {
  echo "usage: sudo hire salman"
  echo "       hire salman --no-open   print the card, don't open email"
}

case "${1:-}" in
  salman | Salman | muhammad-salman) ;;
  -h | --help | "") usage; exit 0 ;;
  *) echo "hire: '$1' is not available. try: sudo hire salman" >&2; exit 1 ;;
esac

if [ "$(id -u)" -eq 0 ]; then
  echo "${G}[sudo] permission granted.${R}"
else
  echo "${D}no sudo? fine, I'm not picky.${R}"
fi
sleep 0.4 2>/dev/null || true

cat <<EOF

  ${T}╭─────────╮${R}   ${B}Muhammad Salman${R}
  ${T}│  ━━━━━${G}●${T} │${R}   ${D}software engineer · backend, ai, devops${R}
  ${T}│  ┃      │${R}
  ${T}│  ━━━━━  │${R}   ${Y}now${R}       backend engineer @ 9D Technologies
  ${T}│      ┃  │${R}   ${Y}oss${R}       code in Jenkins Weekly 2.565 + LTS 2.568.1
  ${T}│  ━━━━━  │${R}   ${Y}gsoc${R}      FOSSology 2025: monolith → 10+ k8s services
  ${T}╰─────────╯${R}   ${Y}ai${R}        LLM agents with guardrails that can't go rogue
                ${Y}based${R}     Lahore, Pakistan · UTC+5 · remote or relocation

  ${M}email${R}   ${EMAIL}
  ${M}site${R}    ${SITE}
  ${M}resume${R}  ${SITE}/resume.pdf
  ${M}github${R}  https://github.com/SalmanDeveloperz

EOF

case "${2:-}" in --no-open) exit 0 ;; esac

URL="mailto:${EMAIL}?subject=${SUBJECT}"
opener=""
if command -v xdg-open >/dev/null 2>&1; then opener="xdg-open"
elif command -v open >/dev/null 2>&1; then opener="open"
fi

if [ -n "$opener" ] && { [ -n "${DISPLAY:-}" ] || [ -n "${WAYLAND_DISPLAY:-}" ] || [ "$opener" = "open" ]; }; then
  echo "${G}opening your mail client…${R}"
  # Under sudo, open the mail app as the real user, not root.
  if [ "$(id -u)" -eq 0 ] && [ -n "${SUDO_USER:-}" ]; then
    sudo -u "$SUDO_USER" "$opener" "$URL" >/dev/null 2>&1 &
  else
    "$opener" "$URL" >/dev/null 2>&1 &
  fi
else
  echo "no desktop to open a mail app from. write to ${B}${EMAIL}${R} and I'll reply within a day."
fi
