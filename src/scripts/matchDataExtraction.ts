namespace MatchDataExtraction {
    const { UI, SS } = Constants;
    const { API_EXTRACTION_SHEET } = Constants.Sheets;

    export function extract() {
        const groupSheets = getGroupSheets();
        const matchIds = getMatchIds(groupSheets);
        const matches = getMatches(matchIds);
        const rows = createRows(matches);

        if (rows.length === 0) {
            UI.alert('No match data found');
            return;
        }

        updateSheet(rows);
    }

    function getGroupSheets() {
        const GROUP_SHEET_NAME_REGEX = /^G\d+/;
        const groupSheetNames = SheetsUtil.getAllSheetNames().filter(e => GROUP_SHEET_NAME_REGEX.test(e));
        const sheets = groupSheetNames.map(name => SS.getSheetByName(name)).filter(e => e !== null);
        return sheets as GoogleAppsScript.Spreadsheet.Sheet[];
    }

    function getMatchIds(sheets: GoogleAppsScript.Spreadsheet.Sheet[]) {
        const ids = sheets
            .map(sheet => {
                const mpLinkCells = sheet.getRange('C14:C32');
                const curIds = mpLinkCells
                    .getValues()
                    .map(row => parseMatchId(row[0].trim()))
                    .filter(e => e !== null) as string[];
                return curIds;
            })
            .reduce((prev, cur) => prev.concat(cur), []);
        return ids;
    }

    function getMatches(matchIds: string[]) {
        const matches = matchIds
            .map(id => OsuApi.getMatch(id))
            .filter(e => typeof e !== 'undefined') as OsuApiTypes.MatchResponse[];
        return matches;
    }

    function parseMatchId(url: string) {
        const match = url.match(/(\d+)$/);
        if (match) {
            return match[1];
        }
        return null;
    }

    function createRows(matches: OsuApiTypes.MatchResponse[]) {
        const allRows = matches
            .map(matchData => {
                const matchRows: string[][] = [];

                const matchName = matchData.match.name;
                const matchId = matchData.match.match_id;

                matchData.games.forEach(game => {
                    const beatmapId = game.beatmap_id;

                    game.scores.forEach(scoreData => {
                        const userId = scoreData.user_id;
                        const score = scoreData.score;
                        matchRows.push([matchName, matchId, beatmapId, userId, score]);
                    });
                });

                return matchRows;
            })
            .reduce((prev, cur) => prev.concat(cur), []);
        return allRows;
    }

    function updateSheet(rows: string[][]) {
        API_EXTRACTION_SHEET?.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
}
