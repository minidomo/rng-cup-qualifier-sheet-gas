let API_EXTRACT_SHEET = SS.getSheetByName('API Extraction');

function extractAllLobbyData() {
    let lobbySheetNames = getAllSheetNames().filter(e => LOBBY_SHEET_NAME_REGEX.test(e));
    let allRowData = [];

    lobbySheetNames.forEach(sheetName => {
        let sheet = SS.getSheetByName(sheetName);

        let mpLinkRange = 'D4:E4';
        let mpLinkCell = sheet.getRange(mpLinkRange);
        let mpLink = mpLinkCell.getValue();

        let id = getMatchId(mpLink);
        if (id) {
            let data = getMatchData(id);
            let rows = createMatchDataRows(data);
            allRowData.push(...rows);
        }
    });

    if (allRowData.length === 0) {
        UI.alert('No lobby data found');
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