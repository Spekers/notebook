# Sip's Logbook

This is the source code for my [notebook blog](https://sips-log.com/). It is a fork of [wesley's notebook](https://github.com/WesleyAC/notebook). I thank them for giving me the inspiration and the generosity of providing their code.

## Archival and Broken Links

The deploy script checks if any outwards links are broken (returning HTTP error codes), and does not allow a deploy if they are (unless the link has been explicitly added to a bypass list). Additionally, before deploying, all outgoing links are archived via [ArchiveBox](https://archivebox.io) to preserve a copy of the link at the time the post was written. This allows easy switching to archived copies of linked websites should they go offline in the future.

## Deep Links

There is some javascript allowing users to create deep links to any text selection. It is fairly lightweight, and the code should work on most websites.

## Changelogs

Whenever I update a post, a changelog is generated from the git history and embedded into the post, allowing people to quickly see how the post has changed over time, including links to diffs.

## Sidenotes

The implementation is based on [tufte-css](https://edwardtufte.github.io/tufte-css/), but there is [additional javascript](/parts/sideline.js) used to draw lines connecting sidenote labels to sidenotes on hover.

## Image compression

Images are automatically compressed with [`pngcrush`](https://pmt.sourceforge.io/pngcrush/), [`optipng`](http://optipng.sourceforge.net/), and [`jpegoptim`](https://github.com/tjko/jpegoptim), and converted to webp. `<img>` tags are replaced with `<picture>` tags that have both the webp version and the original image.

## Comments

Posts have a comment form at the bottom of the page. Comments are handled by a small [Cloudflare Worker](/comments-worker/) backed by a [D1](https://developers.cloudflare.com/d1/) SQLite database, served from `comments.sips-log.com`. Submissions are gated by [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (a privacy-respecting CAPTCHA), rate-limited per salted IP hash, and held for manual approval before they appear publicly. Names and bodies are length-capped and rendered with `textContent` on the client, so HTML in a comment is shown as plain text rather than executed. Only the comment text, a display name, a timestamp, and a salted hash of the submitter's IP are stored — no email, no account.

## Link Prefetching

[Instantpage](https://instant.page/) is used to prefetch links on hover, making loading extremely fast (on supported browsers).

## 404 Page

The [404 page](https://sips-log.com/404) allows you to write what you think should be there, and share it with others should you so wish. It's inspired by [The Creative Independent's](https://thecreativeindependent.com/) 404 page.

## Fonts

I'm using [EB Garamond](https://github.com/octaviopardo/EBGaramond12), an open-source revival of Claude Garamont's 16th-century types by Georg Duffner and Octavio Pardo. It's licensed under the [SIL Open Font License](https://openfontlicense.org/), so the woff2 files are committed directly to this repository under [/static/fonts/](/static/fonts/) and self-hosted alongside the site.

## Mixtapes

Mixtape pages use [98.css](https://jdan.github.io/98.css/) by Jordan Scales to recreate the Windows 95/98 UI aesthetic. Audio files (mp3s) are hosted on [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) and served from a custom subdomain, so the repository stays small and bandwidth is free at the edge.

## Post Template Generator

There is a [script](/bin/author/prompt.sh) to generate a writing prompt, either by tarot pull or moon phase, as well as a script to generate a [blank post template](/bin/author/blank.sh).

## Future Work

In the future, I'd like to make a few improvements to my setup:

* Show archived versions of links, in a similar way to [Robust Links](https://robustlinks.mementoweb.org/).
* Implement outgoing [Webmentions](https://webmention.net/).
* Parallelize broken-link checking.
* Generate changelog diffs locally, instead of linking to GitHub.
* Add search (via [stork](https://stork-search.net/) or [tinysearch](https://endler.dev/2019/tinysearch/)).
* Extend commenting to mixes and journal entries (currently only on posts).
* Add a newsletter with the ability to subscribe

## License

Except where otherwise noted, all code in this repository is licensed under the terms of the [MIT license](https://mit-license.org/). All prose is licensed under the terms of the [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) license.
