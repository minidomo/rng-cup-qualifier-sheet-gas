namespace MatchDataExtraction {
    const { UI, SS } = Constants;
    const { API_EXTRACTION_SHEET } = Constants.Sheets;

    export function extract() {
        const GROUP_SHEET_NAME_REGEX = /^G\d+/;
        const groupSheetNames = SheetsUtil.getAllSheetNames().filter(e => GROUP_SHEET_NAME_REGEX.test(e));
        const allRowData: any[][] = [];

        groupSheetNames.forEach(sheetName => {
            const sheet = SS.getSheetByName(sheetName);
            if (!sheet) {
                return;
            }

            const mpLinkCells = sheet.getRange('C14:C32');
            const ids = mpLinkCells.getValues()
                .map(row => getMatchId(row[0].trim()))
                .filter(id => typeof id === 'string') as string[];

            ids.forEach(id => {
                const data = OsuApi.getMatch(id);
                if (data) {
                    const rows = createRows(data);
                    allRowData.push(...rows);
                }
            });
        });

        if (allRowData.length === 0) {
            UI.alert('No match data found');
            return;
        }

        API_EXTRACTION_SHEET?.getRange(2, 1, allRowData.length, allRowData[0].length).setValues(allRowData);
    }

    function getMatchId(url: string) {
        const match = url.match(/(\d+)$/);
        if (match) {
            return match[1];
        }
        return null;
    }

    function createRows(data: OsuApiTypes.MatchResponse) {
        const matchName = data.match.name;
        const matchId = data.match.match_id;

        const ret: string[][] = [];

        data.games.forEach(game => {
            const beatmapId = game.beatmap_id;

            game.scores.forEach(scoreData => {
                const userId = scoreData.user_id;
                const score = scoreData.score;

                ret.push([matchName, matchId, beatmapId, userId, score]);
            });
        });

        return ret;
    }
}