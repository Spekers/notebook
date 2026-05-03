#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

LATEST_ENTRY="$1"
LATEST_MIX="$2"
OUT_FILE="$3"

LATEST_SLUG=$(basename "$LATEST_ENTRY" | cut -d- -f2- | rev | cut -d. -f2- | rev)
LATEST_TITLE_HTML=$(./bin/build/get-entry-title.sh --html "$LATEST_ENTRY")
LATEST_TS=$(basename "$LATEST_ENTRY" | cut -d- -f1)

LATEST_MIX_SLUG=$(basename "$LATEST_MIX" | cut -d- -f2- | rev | cut -d. -f2- | rev)
LATEST_MIX_TITLE_HTML=$(./bin/build/get-entry-title.sh --html "$LATEST_MIX")
LATEST_MIX_TS=$(basename "$LATEST_MIX" | cut -d- -f1)

# Escape sed-replacement special chars (& \ /) and newlines in title
esc_title=$(printf '%s' "$LATEST_TITLE_HTML" | sed -e 's/[\/&]/\\&/g')
esc_mix_title=$(printf '%s' "$LATEST_MIX_TITLE_HTML" | sed -e 's/[\/&]/\\&/g')

sed \
	-e "s/★PAGE_TITLE★/$BLOG_NAME/g" \
	-e "s/★OG_TITLE★/$BLOG_NAME/g" \
	-e "s/★OG_TYPE★/website/g" \
	-e "s/★TWITTER_CARD_TYPE★/summary/g" \
	-e "/★EXTRA_TAGS★/{
		i <meta property=\"og:image\" content=\"$BLOG_URL/fleuron.png\"/>
		i <meta name=\"description\" content=\"Sip's Log\"/>
	}" \
	-e "/★PAGE_CONTENT★/{
		s/★PAGE_CONTENT★//g
		r ./parts/index.html
	}" \
	./parts/template.html |
sed \
	-e "s/★LATEST_JOURNAL_TS★/$LATEST_TS/g" \
	-e "s/★LATEST_JOURNAL_SLUG★/$LATEST_SLUG/g" \
	-e "s/★LATEST_JOURNAL_TITLE★/$esc_title/g" \
	-e "s/★LATEST_MIX_TS★/$LATEST_MIX_TS/g" \
	-e "s/★LATEST_MIX_SLUG★/$LATEST_MIX_SLUG/g" \
	-e "s/★LATEST_MIX_TITLE★/$esc_mix_title/g" > "$OUT_FILE"
