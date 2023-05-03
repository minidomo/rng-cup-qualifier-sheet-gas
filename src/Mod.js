const Mod = {
    NF: 1,
    HD: 8,
    HR: 16,
    DT: 64,
};

function getModStarRatings() {
    const MOD_STAR_RATING_RANGE = 'F3:G17';

    const starRatingCells = SETTINGS.getRange(MOD_STAR_RATING_RANGE);
    const values = starRatingCells.getValues();

    const temp = values.map(row => row.map(e => typeof e));
    UI.alert(JSON.stringify(temp, null, 4));
}