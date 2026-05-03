#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

LATEST_ENTRY="$1"
OUT_FILE="$2"

LATEST_SLUG=$(basename "$LATEST_ENTRY" | cut -d- -f2- | rev | cut -d. -f2- | rev)
LATEST_TITLE_HTML=$(./bin/build/get-entry-title.sh --html "$LATEST_ENTRY")
LATEST_LINK="<a href='/$LATEST_SLUG/'>$LATEST_TITLE_HTML</a>"

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
sed "s#★LATEST_JOURNAL★#$LATEST_LINK#" > "$OUT_FILE"
