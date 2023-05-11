namespace Debug {
    const { UI } = Constants;

    export function test() {
        const teams = Constants.Sheets.TEAMS_SHEET?.getRange('C3:F')
            .getValues()
            .filter(row => !RowUtil.isEmpty(row))
            .map(row => row.map(e => StringUtil.convert(e))) as string[][];

        const evaluations = EvaluationData.getEvaluations().filter(e => parseInt(e.rank) <= 32);
        const missing: string[] = [];
        const uneven: number[] = [];

        teams.forEach((team, i) => {
            let t1 = 0;
            let t2 = 0;

            team.forEach(username => {
                const evaluation = evaluations.find(e => e.username === username);

                if (!evaluation) {
                    missing.push(username);
                    return;
                }

                if (evaluation.tier === '1') {
                    t1++;
                } else {
                    t2++;
                }
            });

            if (t1 !== 2 || t2 !== 2) {
                uneven.push(i + 1);
            }
        });

        UI.alert(`missing: ${missing}\nuneven teams: ${uneven}`);
    }
}
