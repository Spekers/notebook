#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

MIX_PATH="$1"
OUT_FILE="$2"
MIX_NAME=$(basename "$MIX_PATH")
MIX_SLUG=$(echo "$MIX_NAME" | cut -d- -f2- | rev | cut -d. -f2- | rev)
MIX_FRONT_MATTER=$(sed -n '2,/^---$/{ /^---$/d; p; }' "$MIX_PATH")
MIX_TIMEZONE=$(echo "$MIX_FRONT_MATTER" | jq -r .timezone)
MIX_TIMESTAMP=$(echo "$MIX_NAME" | cut -d- -f1)
MIX_DATE=$(TZ="$MIX_TIMEZONE" date -d @"$MIX_TIMESTAMP" +"%A %B %-d, %Y")
MIX_COVER=$(echo "$MIX_FRONT_MATTER" | jq -r .cover)
MIX_AUDIO=$(echo "$MIX_FRONT_MATTER" | jq -r '.audio // .audio_hi')

mkdir -p "$(dirname "$OUT_FILE")"

BODY=$(./bin/build/strip-front-matter.sh "$MIX_PATH")

MIX_TITLE=$(echo "$BODY" | sed -n -e '/^---$/{n;p}' | head -n1 | sed 's/^#[ ]*//' | pandoc --from=markdown --to=html | sed -e 's#<p>##g' -e 's#</p>##g' | tr -d '\n')
# Fall back: title is the first H1 line in body
MIX_TITLE=$(echo "$BODY" | grep -m1 '^# ' | sed 's/^#[ ]*//')
MIX_TITLE_NOHTML=$MIX_TITLE
MIX_TITLE_SED=$(echo "$MIX_TITLE_NOHTML" | sed 's/[\/&]/\\&/g')

extract_section() {
	local section="$1"
	echo "$BODY" | awk -v s="$section" '
		/^## / { in_s = ($0 == "## " s) ? 1 : 0; next }
		in_s { print }
	'
}

DESCRIPTION_MD=$(extract_section "Description")
TRACKLIST_MD=$(extract_section "Tracklist")
RESEARCH_MD=$(extract_section "Research")

DESCRIPTION_HTML=$(echo "$DESCRIPTION_MD" | pandoc --from=markdown --to=html)
RESEARCH_HTML=$(echo "$RESEARCH_MD" | pandoc --from=markdown --to=html)

TRACKLIST_HTML=$(echo "$TRACKLIST_MD" | awk '
	/^[[:space:]]*-[[:space:]]+[0-9]+:[0-9]+/ {
		line = $0
		sub(/^[[:space:]]*-[[:space:]]+/, "", line)
		# split timestamp and rest
		ts = line
		sub(/[[:space:]].*$/, "", ts)
		rest = line
		sub(/^[^[:space:]]+[[:space:]]+(—[[:space:]]+)?/, "", rest)
		# parse mm:ss or hh:mm:ss
		n = split(ts, parts, ":")
		if (n == 2) { sec = parts[1]*60 + parts[2] }
		else if (n == 3) { sec = parts[1]*3600 + parts[2]*60 + parts[3] }
		else { sec = 0 }
		printf "<li data-t=\"%d\"><span class=\"ts\">%s</span><span>%s</span></li>\n", sec, ts, rest
	}
')

# Build content from template
CONTENT=$(cat ./parts/mix.html)
# Use python for safe replacement (avoids sed escaping hell with URLs and HTML)
CONTENT=$(MIX_TITLE="$MIX_TITLE" \
	MIX_DATE="$MIX_DATE" \
	MIX_COVER="$MIX_COVER" \
	MIX_AUDIO="$MIX_AUDIO" \
	MIX_DESCRIPTION="$DESCRIPTION_HTML" \
	MIX_TRACKLIST="$TRACKLIST_HTML" \
	MIX_RESEARCH="$RESEARCH_HTML" \
	CONTENT="$CONTENT" \
	python3 -c '
import os
c = os.environ["CONTENT"]
for k in ["MIX_TITLE","MIX_DATE","MIX_COVER","MIX_AUDIO","MIX_DESCRIPTION","MIX_TRACKLIST","MIX_RESEARCH"]:
	c = c.replace("★"+k+"★", os.environ[k])
print(c)
')

PAGE_TITLE_SED=$(echo "$MIX_TITLE_NOHTML ⁑ $BLOG_NAME" | sed 's/[\/&]/\\&/g')

echo "$CONTENT" |
sed \
	-e "s/★PAGE_TITLE★/$PAGE_TITLE_SED/g" \
	-e "s/★OG_TITLE★/$MIX_TITLE_SED/g" \
	-e "s/★OG_TYPE★/article/g" \
	-e "s/★TWITTER_CARD_TYPE★/summary/g" \
	-e "/★PAGE_CONTENT★/{
		s/★PAGE_CONTENT★//g
		r /dev/stdin
	}" \
	./parts/template.html > "$OUT_FILE"
