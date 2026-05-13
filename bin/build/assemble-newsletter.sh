#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

LETTER_PATH="$1"
OUT_FILE="$2"
LETTER_NAME=$(basename "$LETTER_PATH")
LETTER_TS=$(echo "$LETTER_NAME" | cut -d- -f1)
LETTER_FRONT_MATTER=$(sed -n '2,/^---$/{ /^---$/d; p; }' "$LETTER_PATH")
LETTER_TIMEZONE=$(echo "$LETTER_FRONT_MATTER" | jq -r .timezone)
LETTER_DATE=$(TZ="$LETTER_TIMEZONE" date -d @"$LETTER_TS" +"%A %B %-d, %Y")

mkdir -p "$(dirname "$OUT_FILE")"

BODY=$(./bin/build/strip-front-matter.sh "$LETTER_PATH")
LETTER_TITLE=$(echo "$BODY" | grep -m1 '^# ' | sed 's/^#[ ]*//')
LETTER_TITLE_SED=$(echo "$LETTER_TITLE" | sed 's/[\/&]/\\&/g')

# Strip the H1 (title) line — it's rendered separately in the header.
BODY_NO_TITLE=$(echo "$BODY" | sed '0,/^# /{//d;}')
LETTER_BODY_HTML=$(echo "$BODY_NO_TITLE" | pandoc --from=markdown --to=html)

CONTENT=$(cat ./parts/newsletter.html)
CONTENT=$(LETTER_TITLE="$LETTER_TITLE" \
	LETTER_DATE="$LETTER_DATE" \
	LETTER_BODY="$LETTER_BODY_HTML" \
	CONTENT="$CONTENT" \
	python3 -c '
import os
c = os.environ["CONTENT"]
for k in ["LETTER_TITLE","LETTER_DATE","LETTER_BODY"]:
	c = c.replace("★"+k+"★", os.environ[k])
print(c)
')

PAGE_TITLE_SED=$(echo "$LETTER_TITLE ⁑ $BLOG_NAME" | sed 's/[\/&]/\\&/g')

echo "$CONTENT" |
sed \
	-e "s/★PAGE_TITLE★/$PAGE_TITLE_SED/g" \
	-e "s/★OG_TITLE★/$LETTER_TITLE_SED/g" \
	-e "s/★OG_TYPE★/article/g" \
	-e "s/★TWITTER_CARD_TYPE★/summary/g" \
	-e "/★EXTRA_TAGS★/{
		i <link rel=\"stylesheet\" href=\"/newsletter.min.css\"/>
	}" \
	-e "/★PAGE_CONTENT★/{
		s/★PAGE_CONTENT★//g
		r /dev/stdin
	}" \
	./parts/template.html > "$OUT_FILE"
