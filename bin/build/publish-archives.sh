#!/usr/bin/env bash

# Publishes locally-archived snapshots referenced by data/archive_map.tsv
# into out/site/archive/<slug>/index.html so they can be linked to from
# entries when the original URL has rotted and no public mirror exists.

set -e
cd "$(dirname "$0")"/../..

MANIFEST="data/archive_map.tsv"
[ -f "$MANIFEST" ] || exit 0

while IFS=$'\t' read -r SLUG TIMESTAMP URL; do
    [ -z "$SLUG" ] && continue
    case "$SLUG" in '#'*) continue ;; esac
    SNAPSHOT="data/archivebox/archive/$TIMESTAMP/singlefile.html"
    if [ ! -f "$SNAPSHOT" ]; then
        echo "warning: missing snapshot $SNAPSHOT (slug=$SLUG, url=$URL)" >&2
        continue
    fi
    DEST="out/site/archive/$SLUG/index.html"
    mkdir -p "$(dirname "$DEST")"
    cp "$SNAPSHOT" "$DEST"
done < "$MANIFEST"
