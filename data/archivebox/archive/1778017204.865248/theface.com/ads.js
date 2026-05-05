// Device sizes
const deviceSizes = {
    mobile: [0, 0],
    tablet: [640, 480],
    desktop: [1024, 768],
};

// These are set on GAM
const adUnits = {
    "149393820/TheFace/theface.com_adhesion": {
        [deviceSizes.desktop]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
            [468, 60],
        ],
    },
    "149393820/TheFace/theface.com_articles_dynamic": {
        [deviceSizes.desktop]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
            [300, 250],
        ],
    },
    "149393820/TheFace/theface.com_billboard_top": {
        [deviceSizes.desktop]: [
            [1, 1],
            [300, 250],
            [728, 90],
            [970, 90],
            [970, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [300, 250],
            [728, 90],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [300, 250],
            [320, 50],
            [320, 100],
            [336, 280],
        ],
    },
    "149393820/TheFace/theface.com_leaderboard_1": {
        [deviceSizes.desktop]: [
            [1, 1],
            [728, 90],
            [970, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
        ],
    },
    "149393820/TheFace/theface.com_leaderboard_2": {
        [deviceSizes.desktop]: [
            [1, 1],
            [728, 90],
            [970, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
        ],
    },
    "149393820/TheFace/theface.com_left_rail": {
        [deviceSizes.desktop]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.mobile]: [],
    },
    "149393820/TheFace/theface.com_mpu_1": {
        [deviceSizes.desktop]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
            [336, 280],
        ],
    },
    "149393820/TheFace/theface.com_mpu_2": {
        [deviceSizes.desktop]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
            [336, 280],
        ],
    },
    "149393820/TheFace/theface.com_mpu_3": {
        [deviceSizes.desktop]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [300, 250],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
            [336, 280],
        ],
    },
    "149393820/TheFace/theface.com_pushdown": {
        [deviceSizes.desktop]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [728, 90],
        ],
        [deviceSizes.mobile]: [
            [1, 1],
            [300, 50],
            [300, 100],
            [320, 50],
            [320, 100],
        ],
    },
    "149393820/TheFace/theface.com_right_rail": {
        [deviceSizes.desktop]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.mobile]: [],
    },
    "149393820/TheFace/theface.com_sidewall_right": {
        [deviceSizes.desktop]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.tablet]: [
            [1, 1],
            [120, 600],
            [160, 600],
            [300, 250],
            [300, 600],
        ],
        [deviceSizes.mobile]: [],
    },
    "149393820/TheFace/Teads": {
        [deviceSizes.desktop]: [[1, 1]],
        [deviceSizes.tablet]: [[1, 1]],
        [deviceSizes.mobile]: [[1, 1]],
    },
};

// console.log(adUnits);

window.googletag = window.googletag || { cmd: [] };

googletag.cmd.push(function () {
    const adsOnThisPage = document.querySelectorAll("[data-mutual-ad]");

    // For each adsOnThisPage it exists as a key in adUnits and if it does then set a unique ID on the DOM element
    adsOnThisPage.forEach((ad) => {
        const adUnit = adUnits[ad.dataset.mutualAd];
        if (adUnit) {
            const adName = ad.dataset.mutualAd;
            id = `${adName}-${self.crypto.randomUUID()}`;
            ad.id = id; // Add a unique ID to the DOM element

            // Get all of the sizes for this ad unit
            const sizes = [];
            Object.keys(adUnit).forEach((deviceSize) => {
                adUnit[deviceSize].forEach((size) => {
                    // Only push if this exact array isn't already in the sizes array
                    if (
                        !sizes.some((s) => s[0] === size[0] && s[1] === size[1])
                    ) {
                        sizes.push(size);
                    }
                });
            });

            // console.log('adUrl', adUrl)
            // console.log('adSection', adSection)
            // console.log('adTag', adTag)

            // new ad targeting tags
            // console.log('adArticleId', adArticleId)
            // console.log('adCategory', adCategory)
            // console.log('adTags', adTags)
            // console.log('adEnv', adEnv)

            var unit = googletag
                .defineSlot(
                    adName, // Name
                    sizes, // Sizes
                    id // Automatically generated ID (above)
                )
                .addService(googletag.pubads())
                .setTargeting("p", adUrl)
                .setTargeting("s", adSection)
                .setTargeting("t", adTag)
                // set new ad targeting keys
                .setTargeting("articleId", adArticleId)
                .setTargeting("category", adCategory)
                .setTargeting("tags", adTags)
                .setTargeting("env", adEnv);

            var mapping = googletag
                .sizeMapping()
                .addSize(deviceSizes.desktop, adUnit[deviceSizes.desktop])
                .addSize(deviceSizes.tablet, adUnit[deviceSizes.tablet])
                .addSize(deviceSizes.mobile, adUnit[deviceSizes.mobile])
                .build();

            unit.defineSizeMapping(mapping);
        }
    });

    googletag.pubads().enableSingleRequest();
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
});

// Display any ads on the page
googletag.cmd.push(function () {
    const adsOnThisPage = document.querySelectorAll("[data-mutual-ad]");
    adsOnThisPage.forEach((ad) => {
        const adUnit = adUnits[ad.dataset.mutualAd];
        if (adUnit) {
            googletag.display(ad.id);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const adsOnThisPage = document.querySelectorAll("[data-mutual-ad]");

    const removeSpacingIfHidden = (adSlot) => {
        const parentDiv = adSlot.closest(".ad-spacer");
        if (parentDiv) {
            const isHidden = getComputedStyle(adSlot).display === "none";
            if (isHidden) {
                parentDiv.classList.remove("tw-my-12");
            } else {
                parentDiv.classList.add("tw-my-12");
            }
        }
    };

    googletag.cmd.push(() => {
        adsOnThisPage.forEach((adSlot) => {
            removeSpacingIfHidden(adSlot);

            const observer = new MutationObserver(() => {
                removeSpacingIfHidden(adSlot);
            });

            observer.observe(adSlot, {
                attributes: true,
                attributeFilter: ["style"],
            });
        });
    });
});
