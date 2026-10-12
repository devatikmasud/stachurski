#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! command -v php >/dev/null 2>&1; then
  echo "PHP CLI is required for contact form preview. Install PHP 8.1+ or open index.html directly for a static visual preview."
  exit 1
fi
exec php -S 127.0.0.1:8000 -t .
