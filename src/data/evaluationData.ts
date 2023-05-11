namespace EvaluationData {
    const { SS } = Constants;
    const SHEET_NAME_REGEX = /^Evaluations - T(\d+)$/;

    export function getEvaluations() {
        const evaluationSheets = getEvaluationSheets();
        const evaluations = parseSheets(evaluationSheets);
        return evaluations;
    }

    function parseSheets(evaluationSheets: GoogleAppsScript.Spreadsheet.Sheet[]) {
        const ret = evaluationSheets
            .map(sheet => {
                const match = sheet.getSheetName().match(SHEET_NAME_REGEX) as RegExpMatchArray;
                const tier = match[1];

                const metadataValues = sheet.getRange('B3:G').getValues();
                const scoreValues = sheet.getRange('I3:W').getValues();

                const evaluations: EvaluationDataTypes.Evaluation[] = [];

                metadataValues.forEach((row, i) => {
                    if (RowUtil.isEmpty(row)) {
                        return;
                    }

                    const scores = scoreValues[i].map(e => StringUtil.convert(e)).filter(e => e !== '');

                    const evaluation: EvaluationDataTypes.Evaluation = {
                        tier,
                        matchName: StringUtil.convert(row[0]),
                        matchId: StringUtil.convert(row[1]),
                        userId: StringUtil.convert(row[2]),
                        username: StringUtil.convert(row[3]),
                        points: StringUtil.convert(row[4]),
                        rank: StringUtil.convert(row[5]),
                        scores,
                    };

                    evaluations.push(evaluation);
                });

                return evaluations;
            })
            .reduce((prev, cur) => prev.concat(cur), []);

        return ret;
    }

    function getEvaluationSheets() {
        const groupSheetNames = SheetsUtil.getAllSheetNames().filter(e => SHEET_NAME_REGEX.test(e));
        const sheets = groupSheetNames.map(name => SS.getSheetByName(name)).filter(e => e !== null);
        return sheets as GoogleAppsScript.Spreadsheet.Sheet[];
    }
}
