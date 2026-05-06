/**
 * Article gallery: 3-up desktop / 1-up small screens; one image per step.
 * Infinite loop: the same photo sequence is repeated end-to-end (triplicate buffer);
 * after the last photo, the next step shows the first again — no separate “row padding” clones.
 */

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleries);
    } else {
        initGalleries();
    }

    function initGalleries() {
        document.querySelectorAll('.article-gallery').forEach(initGalleryNavigation);
    }

    function initGalleryNavigation(gallery) {
        const track = gallery.querySelector('.article-gallery-track');
        const viewportEl = gallery.querySelector('.article-gallery-viewport');
        const prevBtn = gallery.querySelector('.article-gallery-prev');
        const nextBtn = gallery.querySelector('.article-gallery-next');
        const initialItems = gallery.querySelectorAll('.article-gallery-item');
        const sourceCount =
            Number.parseInt(gallery.dataset.totalImages || `${initialItems.length}`, 10) ||
            initialItems.length;

        if (!track || !viewportEl || initialItems.length === 0 || !prevBtn || !nextBtn) return;

        const templateInnerHTML = track.innerHTML;
        let period = 0;
        let offset = 0;

        function itemsPerPage() {
            return window.matchMedia('(min-width: 1024px)').matches ? 3 : 1;
        }

        /**
         * Three identical copies of the full gallery (server order only), for seamless looping.
         */
        function buildLoopStrip() {
            const block = Array.from(track.children);
            period = block.length;
            if (period === 0) return;

            track.innerHTML = '';
            for (let c = 0; c < 3; c++) {
                block.forEach((node) => {
                    const el = node.cloneNode(true);
                    if (c > 0) {
                        el.classList.add('article-gallery-item--loop-copy');
                        el.setAttribute('aria-hidden', 'true');
                    }
                    track.appendChild(el);
                });
            }
        }

        function rebuildTrackStructure() {
            track.innerHTML = templateInnerHTML;
            buildLoopStrip();
            offset = period;
        }

        function slideCount() {
            return track.querySelectorAll('.article-gallery-item').length;
        }

        function canStep() {
            return period > 0 && slideCount() > itemsPerPage();
        }

        /**
         * Pixel offset = sum of each slide's layout width up to the leftmost visible slide.
         * Matches flex row geometry exactly so the loop reset doesn't disagree with the browser's
         * transition end state (avoids subpixel flash at the seam).
         */
        function translatePx() {
            const slides = track.children;
            const len = slides.length;
            if (len === 0 || offset === 0) return 0;
            const count = Math.min(offset, len);
            let total = 0;
            for (let i = 0; i < count; i++) {
                total += slides[i].offsetWidth;
            }
            return total;
        }

        function applyTransform() {
            track.style.transform = `translate3d(-${translatePx()}px, 0, 0)`;
            const ok = canStep();
            prevBtn.disabled = !ok;
            nextBtn.disabled = !ok;
        }

        /**
         * Snap index back one cycle without animating. Same visual as before the reset; must use
         * the same translatePx() math the transition ended on.
         */
        function normalizeOffsetSilently() {
            if (period === 0) return;
            let changed = false;
            while (offset >= 2 * period) {
                offset -= period;
                changed = true;
            }
            while (offset < period) {
                offset += period;
                changed = true;
            }
            if (!changed) return;
            track.style.transition = 'none';
            track.style.transform = `translate3d(-${translatePx()}px, 0, 0)`;
            void track.offsetWidth;
            track.style.removeProperty('transition');
        }

        function onTrackTransitionEnd(e) {
            if (e.target !== track || e.propertyName !== 'transform') return;
            normalizeOffsetSilently();
        }

        track.addEventListener('transitionend', onTrackTransitionEnd);

        function stepNext() {
            if (!canStep()) return;
            offset += 1;
            applyTransform();
        }

        function stepPrev() {
            if (!canStep()) return;
            offset -= 1;
            applyTransform();
        }

        function updateNavVisibility() {
            const needsNav = sourceCount > itemsPerPage();
            prevBtn.style.display = needsNav ? '' : 'none';
            nextBtn.style.display = needsNav ? '' : 'none';
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stepPrev();
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stepNext();
        });

        let isGalleryFocused = false;
        gallery.addEventListener('mouseenter', () => {
            isGalleryFocused = true;
        });
        gallery.addEventListener('mouseleave', () => {
            isGalleryFocused = false;
        });
        gallery.setAttribute('tabindex', '0');
        gallery.addEventListener('focus', () => {
            isGalleryFocused = true;
        });
        gallery.addEventListener('blur', () => {
            isGalleryFocused = false;
        });

        document.addEventListener('keydown', (e) => {
            if (!isGalleryFocused) return;
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                e.preventDefault();
                stepPrev();
            } else if (e.key === 'ArrowRight' || e.key === 'Right') {
                e.preventDefault();
                stepNext();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        gallery.addEventListener(
            'touchstart',
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
            },
            { passive: true }
        );

        gallery.addEventListener(
            'touchend',
            (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (Math.abs(swipeDistance) <= minSwipeDistance) return;
                if (swipeDistance > 0) {
                    stepPrev();
                } else {
                    stepNext();
                }
            },
            { passive: true }
        );

        function onResize() {
            rebuildTrackStructure();
            updateNavVisibility();
            applyTransform();
        }

        window.addEventListener('resize', onResize, { passive: true });

        rebuildTrackStructure();
        updateNavVisibility();
        applyTransform();
    }

    function observeGalleries() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('gallery-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('.article-gallery').forEach((gallery) => observer.observe(gallery));
    }

    observeGalleries();
})();
