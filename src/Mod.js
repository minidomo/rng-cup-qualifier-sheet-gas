let Mod = {
    NF: 1,
    HD: 8,
    HR: 16,
    DT: 64,
};

let ModCategory = {
    Freemod: 0,
    NM: 1,
    HD: 2,
    DT: 3,
    HR: 4,
};

function getModStarRatings() {
    let starRatingCells = SS.getRangeByName('ModStarRatings');
    let values = starRatingCells.getValues().filter(row => row.every(e => e !== ''));

    if (values.length === 0) {
        UI.alert('Mod star ratings not found');
    }

    let starRatings = Object.fromEntries(values);
    return starRatings;
}

function getModCombinationPercentages() {
    let modCombinationCells = SS.getRangeByName('ModComboPercentages');
    let values = modCombinationCells.getValues().filter(row => row.every(e => e !== ''));

    if (values.length === 0) {
        UI.alert('Mod combination percentages not found');
    }

    let percentages = Object.fromEntries(values);
    return percentages;
}

function randomMods(percentages) {
    let cutoffs = Object.assign({}, percentages);
    Object.keys(cutoffs).forEach((key, i, arr) => {
        let prevIndex = i - 1;
        if (prevIndex >= 0) {
            cutoffs[key] += cutoffs[arr[prevIndex]];
        }
    });

    let r = Math.random();
    let modComboString = '';
    Object.keys(cutoffs).forEach((key, i, arr) => {
        if (i === 0) {
            if (r < cutoffs[key]) {
                modComboString = key;
            }
        } else {
            let prevCutoff = cutoffs[arr[i - 1]];
            if (prevCutoff < r && r < cutoffs[key]) {
                modComboString = key;
            }
        }
    });


    if (modComboString === 'Freemod') {
        return [];
    }

    if (modComboString === 'NM') {
        return [Mod.NF];
    }

    let MOD_SEPARATOR_REGEX = /.{2}/g;
    let mods = modComboString.match(MOD_SEPARATOR_REGEX)
        .map(e => Mod[e]);
    mods.push(Mod.NF);

    return mods;
}

function determineModCategory(mods) {
    if (mods.length === 0) {
        return ModCategory.Freemod;
    }

    if (mods.some(e => e === Mod.DT)) {
        return ModCategory.DT;
    }

    if (mods.some(e => e === Mod.HR)) {
        return ModCategory.HR;
    }

    if (mods.some(e => e === Mod.HD)) {
        return ModCategory.HD;
    }

    return ModCategory.NM;
}

function determineModStarRating(modStarRatings, mods) {
    let modCategory = determineModCategory(mods);

    for (let key in modStarRatings) {
        if (ModCategory[key] === modCategory) {
            return modStarRatings[key];
        }
    }

    UI.alert('Could not determine star rating');
    return null;
}

function generateMpModsCommand(mods) {
    if (determineModCategory(mods) === ModCategory.Freemod) {
        return '!mp mods Freemod';
    }

    let modKeys = Object.keys(Mod);
    let modsString = mods.map(e => modKeys.find(key => Mod[key] === e)).join(' ');
    return `!mp mods ${modsString}`;
}