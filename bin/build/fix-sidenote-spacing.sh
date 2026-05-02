#!/usr/bin/env bash

perl -0777 -pe '
	s{\s*(<label[^>]*class=["'\'']margin-toggle sidenote-number["'\''])}{$1}g;
	s{(</span>)\s+([A-Za-z0-9])}{$1 $2}g;
	s{</span>\s+([,.;:!?])}{</span>$1}g;
'
