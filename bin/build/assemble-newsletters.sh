#!/usr/bin/env bash

set -e
cd "$(dirname "$0")"/../../
source ./bin/build/vars.sh

OUT_FILE="${!#}"
HTML_ENTRIES=()

while (( $# > 1 ))
do
	LETTER_NAME=$(basename "$1")
	LETTER_SLUG=$(echo "$LETTER_NAME" | cut -d- -f2- | rev | cut -d. -f2- | rev)
	LETTER_TS=$(echo "$LETTER_NAME" | cut -d- -f1)
	LETTER_TITLE=$(grep -m1 '^# ' "$1" | sed 's/^#[ ]*//')
	LETTER_FRONT_MATTER=$(sed -n '2,/^---$/{ /^---$/d; p; }' "$1")
	LETTER_TIMEZONE=$(echo "$LETTER_FRONT_MATTER" | jq -r .timezone)
	LETTER_DATE=$(TZ="$LETTER_TIMEZONE" date -d @"$LETTER_TS" +"%B %-d, %Y")
	HTML_ENTRIES+=("<li><a href='/newsletters/$LETTER_SLUG/'>$LETTER_TITLE</a><span class='letter-meta'>$LETTER_DATE</span></li>")
	shift
done

mkdir -p "$(dirname "$OUT_FILE")"

sed \
	-e "s/★PAGE_TITLE★/$BLOG_NAME — Newsletter/g" \
	-e "s/★OG_TITLE★/$BLOG_NAME — Newsletter/g" \
	-e "s/★OG_TYPE★/website/g" \
	-e "s/★TWITTER_CARD_TYPE★/summary/g" \
	-e "/★EXTRA_TAGS★/{
		i <meta property=\"og:image\" content=\"$BLOG_URL/fleuron.png\"/>
		i <meta name=\"description\" content=\"Sip's Newsletter — to be updated on my brain\"/>
	}" \
	-e "/★PAGE_CONTENT★/{
		s/★PAGE_CONTENT★//g
		r ./parts/newsletters.html
	}" \
	./parts/template.html > "$OUT_FILE"

printf '%s\n' "${HTML_ENTRIES[@]}" |
sed -i "/★LETTER_LIST★/{
	s/★LETTER_LIST★//g
	r /dev/stdin
}" "$OUT_FILE"
