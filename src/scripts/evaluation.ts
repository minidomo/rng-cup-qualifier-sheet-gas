namespace Evaluation {
    const { UI, SS } = Constants;
    const { EVALUATIONS_TEMPLATE_SHEET } = Constants.Sheets;

    interface InnerUserEvaluation {
        matchName: string;
        matchId: string;
        userId: string;
        username: string;
        points: number;
        rank: number;
        scores: number[];
    }

    export function evaluateTier1() {
        evaluate(1);
    }

    export function evaluateTier2() {
        evaluate(2);
    }

    function evaluate(tier: number) {
        const users = UserData.getRegisteredUsers().filter(user => user.tier === `${tier}`);
        const scores = ScoreData.getScores();

        if (users.length === 0) {
            UI.alert(`No tier ${tier} users found`);
            return;
        }

        if (scores.length === 0) {
            UI.alert('No scores found');
            return;
        }

        const evals = users
            .map(user => {
                const playerScores = scores.filter(score => score.userId === user.osu.id);

                if (!areFromSingleMatch(playerScores)) {
                    return null;
                }

                const numericalScores = playerScores.map(score => parseInt(score.score));
                const points = determinePoints(tier, numericalScores);

                const userEvaluation: InnerUserEvaluation = {
                    matchName: playerScores[0].match.name,
                    matchId: playerScores[0].match.id,
                    userId: user.osu.id,
                    username: user.osu.username,
                    points,
                    rank: 0, // placeholder
                    scores: numericalScores,
                };

                return userEvaluation;
            })
            .filter(e => e !== null) as InnerUserEvaluation[];
        evals.sort((a, b) => b.points - a.points);
        evals.forEach((e, i) => (e.rank = i + 1));

        if (evals.length === 0) {
            UI.alert('No valid user data and scores found');
            return;
        }

        const rows = evals.map(e => [e.matchName, e.matchId, e.userId, e.username, e.points, e.rank, '', ...e.scores]);

        const sheet = createEvaluationSheet(tier);
        rows.forEach((row, i) => {
            sheet?.getRange(3 + i, 2, 1, row.length).setValues([row]);
        });
    }

    function areFromSingleMatch(scores: ScoreDataTypes.Score[]) {
        const set = new Set(scores.map(e => e.match.id));
        return set.size === 1;
    }

    function determinePoints(tier: number, scores: number[]): number {
        const minCount = tier === 1 ? 3 : 5;
        if (scores.length < minCount) {
            return -1;
        }

        const sortedScores = scores.slice().sort((a, b) => a - b);

        const midpoint = Math.floor(sortedScores.length / 2);
        const offset = midpoint - Math.floor(minCount / 2);

        let sum = 0;
        for (let i = offset; i < offset + minCount; i++) {
            sum += sortedScores[i];
        }

        return sum;
    }

    function createEvaluationSheet(tier: number) {
        if (!EVALUATIONS_TEMPLATE_SHEET) {
            UI.alert('No evaluation template sheet found');
            return;
        }

        const sheetName = `Evaluations - T${tier}`;

        let sheet = SS.getSheetByName(sheetName);
        if (sheet) {
            SS.deleteSheet(sheet);
        }

        sheet = EVALUATIONS_TEMPLATE_SHEET.copyTo(SS);
        sheet.setName(sheetName);

        return sheet;
    }
}
