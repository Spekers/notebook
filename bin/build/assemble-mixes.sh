#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

OUT_FILE="${!#}"
HTML_ENTRIES=()

while (( $# > 1 ))
do
	MIX_NAME=$(basename "$1")
	MIX_SLUG=$(echo "$MIX_NAME" | cut -d- -f2- | rev | cut -d. -f2- | rev)
	MIX_TITLE=$(grep -m1 '^# ' "$1" | sed 's/^#[ ]*//')
	HTML_ENTRIES+=("<li><a href='/mixes/$MIX_SLUG/'>$MIX_TITLE</a></li>")
	shift
done

mkdir -p "$(dirname "$OUT_FILE")"

sed \
	-e "s/★PAGE_TITLE★/$BLOG_NAME — Mixtapes/g" \
	-e "s/★OG_TITLE★/$BLOG_NAME — Mixtapes/g" \
	-e "s/★OG_TYPE★/website/g" \
	-e "s/★TWITTER_CARD_TYPE★/summary/g" \
	-e "/★EXTRA_TAGS★/{
		i <meta property=\"og:image\" content=\"$BLOG_URL/fleuron.png\"/>
		i <meta name=\"description\" content=\"Sip's mixtapes\"/>
	}" \
	-e "/★PAGE_CONTENT★/{
		s/★PAGE_CONTENT★//g
		r /dev/stdin
	}" \
	./parts/template.html < ./parts/mixes.html > "$OUT_FILE"

printf '%s\n' "${HTML_ENTRIES[@]}" |
sed -i "/★MIX_LIST★/{
	s/★MIX_LIST★//g
	r /dev/stdin
}" "$OUT_FILE"
