function extractAllMatchData() {
    let groupSheetNames = getAllSheetNames().filter(e => GROUP_SHEET_NAME_REGEX.test(e));
    let allRowData = [];

    groupSheetNames.forEach(sheetName => {
        let sheet = SS.getSheetByName(sheetName);

        let mpLinkRange = 'C14:C32';
        let mpLinkCells = sheet.getRange(mpLinkRange);
        let ids = mpLinkCells.getValues()
            .map(row => getMatchId(row[0].trim()))
            .filter(id => id);

        ids.forEach(id => {
            let data = getMatchData(id);
            let rows = createMatchDataRows(data);
            allRowData.push(...rows);
        });
    });

    if (allRowData.length === 0) {
        UI.alert('No match data found');
        return;
    }

    API_EXTRACT_SHEET.getRange(2, 1, allRowData.length, allRowData[0].length).setValues(allRowData);
}

function getMatchId(url) {
    let mpLinkRegex = /(\d+)$/;
    let match = url.match(mpLinkRegex);

    if (match) {
        return match[1];
    }

    return null;
}

function createMatchDataRows(data) {
    let matchName = data.match.name;
    let matchId = data.match.match_id;

    const ret = [];

    data.games.forEach(game => {
        let beatmapId = game.beatmap_id;

        game.scores.forEach(scoreData => {
            let userId = scoreData.user_id;
            let score = scoreData.score;

            ret.push([matchName, matchId, beatmapId, userId, score]);
        });
    });

    return ret;
}