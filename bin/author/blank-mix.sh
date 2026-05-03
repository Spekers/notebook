#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"/../../

MIX_SLUG="$1"

if [ "$#" -ne 1 ]; then
	MIX_SLUG=$(date +"%m-%d-%Y")
fi

MIX_PATH=./mixes/$(date +'%s')-$MIX_SLUG.md
TIMEZONE=$(date +%Z)

cat <<MIX_START_TEXT > "$MIX_PATH"
---
{
	"timezone": "$TIMEZONE",
	"cover": "/img/mix/$MIX_SLUG.jpg",
	"audio": "https://media.sips-log.com/$MIX_SLUG.mp3"
}
---
#

## Description

## Tracklist
- 00:00 —

## Research

MIX_START_TEXT

$EDITOR "$MIX_PATH"
