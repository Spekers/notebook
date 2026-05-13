#!/usr/bin/env bash

# Rescues a single rotted URL.
#
# Tries Wayback Machine first; falls back to the local ArchiveBox snapshot.
# On success, rewrites the URL in any source markdown that contains it, and
# (for local snapshots) records the mapping in data/archive_map.tsv so the
# build can publish the snapshot into out/site/archive/<slug>/index.html.

set -e
cd "$(dirname "$0")"/..

URL="$1"
if [ -z "$URL" ]; then
    echo "usage: $0 <url>" >&2
    exit 2
fi

MANIFEST="data/archive_map.tsv"

SOURCES=$(grep -rln --include="*.md" -F "$URL" entries/ drafts/ mixes/ newsletters/ 2>/dev/null || true)
if [ -z "$SOURCES" ]; then
    echo "skip: $URL not present in any source markdown (already rescued?)" >&2
    exit 0
fi

NEW_URL=""

URL_ENC=$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' "$URL")
WAYBACK_RESP=$(curl -sS --max-time 10 "https://archive.org/wayback/available?url=$URL_ENC" 2>/dev/null || true)
WAYBACK_URL=$(printf '%s' "$WAYBACK_RESP" | jq -r '.archived_snapshots.closest.url // empty' 2>/dev/null || true)
if [ -n "$WAYBACK_URL" ]; then
    NEW_URL="$WAYBACK_URL"
    echo "found on Wayback: $NEW_URL"
fi

if [ -z "$NEW_URL" ]; then
    URL_ESC=$(printf '%s' "$URL" | sed "s/'/''/g")
    TIMESTAMP=$(sqlite3 data/archivebox/index.sqlite3 "SELECT timestamp FROM core_snapshot WHERE url = '$URL_ESC' ORDER BY timestamp DESC LIMIT 1")
    if [ -z "$TIMESTAMP" ]; then
        echo "no archive found anywhere for $URL" >&2
        exit 1
    fi
    SNAPSHOT="data/archivebox/archive/$TIMESTAMP/singlefile.html"
    if [ ! -f "$SNAPSHOT" ]; then
        echo "local snapshot missing at $SNAPSHOT" >&2
        exit 1
    fi
    SLUG=$(printf '%s' "$URL" | sha256sum | cut -c1-12)
    NEW_URL="/archive/$SLUG/"

    touch "$MANIFEST"
    if ! grep -q "^$SLUG	" "$MANIFEST"; then
        printf '%s\t%s\t%s\n' "$SLUG" "$TIMESTAMP" "$URL" >> "$MANIFEST"
    fi
    echo "using local archive snapshot $SNAPSHOT -> /archive/$SLUG/"
fi

echo "$SOURCES" | while IFS= read -r FILE; do
    [ -z "$FILE" ] && continue
    OLD="$URL" NEW="$NEW_URL" python3 - "$FILE" <<'PY'
import os, sys, pathlib
path = sys.argv[1]
old = os.environ["OLD"]
new = os.environ["NEW"]
p = pathlib.Path(path)
text = p.read_text()
if old not in text:
    sys.exit(0)
p.write_text(text.replace(old, new))
print(f"rewrote {path}")
PY
done

echo "done. rebuild to apply."
