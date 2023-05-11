namespace ScoreData {
    const { SS } = Constants;

    export function getScores() {
        const rows = SS.getRange('API Extraction!A2:E').getValues()
            .filter(row => !RowUtil.isEmpty(row));
        const scores = toScores(rows);
        return scores;
    }

    function toScores(rows: any[][]) {
        const scores = rows.map(row => {
            const score: ScoreDataTypes.Score = {
                match: {
                    name: StringUtil.convert(row[0]),
                    id: StringUtil.convert(row[1]),
                },
                beatmapId: StringUtil.convert(row[2]),
                userId: StringUtil.convert(row[3]),
                score: StringUtil.convert(row[4]),
            };

            return score;
        });

        return scores;
    }
}