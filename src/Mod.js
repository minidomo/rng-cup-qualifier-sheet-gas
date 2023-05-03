const Mod = {
    NF: 1,
    HD: 8,
    HR: 16,
    DT: 64,
};

function getModStarRatings() {
    const MOD_STAR_RATING_RANGE = 'F3:G17';
    const starRatingCells = SETTINGS.getRange(MOD_STAR_RATING_RANGE);
    const values = starRatingCells.getValues().filter(row => row.every(e => e !== ''));
    const starRatings = Object.fromEntries(values);
    return starRatings;
}

function getModCombinationPercentages() {
    const MOD_COMBINATION_RANGE = 'I3:J17';
    const modCombinationCells = SETTINGS.getRange(MOD_COMBINATION_RANGE);
    const values = modCombinationCells.getValues().filter(row => row.every(e => e !== ''));
    const percentages = Object.fromEntries(values);
    return percentages;
}

function randomMod() {
    const percentages = getModCombinationPercentages();

    const cutoffs = Object.assign({}, percentages);
    Object.keys(cutoffs).forEach((key, i, arr) => {
        const prevIndex = i - 1;
        if (prevIndex >= 0) {
            cutoffs[key] += cutoffs[arr[prevIndex]];
        }
    });

    const r = Math.random();
    let mod = null;
    Object.keys(cutoffs).forEach((key, i, arr) => {
        if (i === 0) {
            if (r < cutoffs[key]) {
                mod = key;
            }
        } else {
            const prevCutoff = cutoffs[arr[i - 1]];
            if (prevCutoff < r && r < cutoffs[key]) {
                mod = key;
            }
        }
    });

    return mod;
}