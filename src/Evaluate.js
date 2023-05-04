function createEvaluationSheet(tier) {
    let sheetName = `Evaluations - T${tier}`;
    let sheet = SS.getSheetByName(sheetName);
    if (sheet) {
        SS.deleteSheet(sheet);
    }

    let EVALUATION_TEMPLATE_SHEET = SS.getSheetByName('Evaluations - Template');
    sheet = EVALUATION_TEMPLATE_SHEET.copyTo(SS);
    sheet.setName(sheetName);

    return sheet;
}

function evaluateTier1() {
    evaluate(1);
}

function evaluateTier2() {
    evaluate(2);
}

function evaluate(tier) {
    let scores = readScoreData();
    let users = readUserData().filter(e => e.tier === tier);
    let usersAndScores = mergeUsersAndScores(users, scores).sort((a, b) => b.totalScore - a.totalScore);

    if (usersAndScores.length === 0) {
        UI.alert('No user data or scores found');
        return;
    }

    let generalData = usersAndScores.map(user => [
        user.matchName,
        user.matchId,
        user.id,
        user.username,
        user.totalScore,
    ]);

    let scoreData = usersAndScores.map(user => user.scores);

    let sheet = createEvaluationSheet(tier);
    sheet.getRange(3, 2, generalData.length, generalData[0].length).setValues(generalData);

    scoreData.forEach((scores, i) => {
        sheet.getRange(3 + i, 8, 1, scores.length).setValues([scores]);
    });
}

function readUserData() {
    let userDataRange = 'L3:N';
    let userData = SETTINGS.getRange(userDataRange)
        .getValues()
        .filter(row => row.every(e => e !== ''))
        .map(row => (
            {
                id: `${row[0]}`,
                username: row[1],
                tier: parseInt(row[2]),
            }
        ));
    return userData;
}

function readScoreData() {
    let dataRanges = 'A2:E';
    let data = API_EXTRACT_SHEET.getRange(dataRanges)
        .getValues()
        .filter(row => row.every(e => e !== ''))
        .map(row => (
            {
                matchName: row[0],
                matchId: `${row[1]}`,
                beatmapId: `${row[2]}`,
                userId: `${row[3]}`,
                score: parseInt(row[4]),
            }
        ));
    return data;
}

function mergeUsersAndScores(users, scores) {
    let ret = users.map(user => {
        let userScores = scores.filter(e => e.userId === user.id)
            .map(e => e.score);
        let totalScore = userScores.reduce((prev, cur) => prev + cur, 0);

        let matchName = '';
        let matchId = '';

        if (scores.length > 0) {
            matchName = scores[0].matchName;
            matchId = scores[0].matchId;
        }

        return {
            ...user,
            matchName,
            matchId,
            totalScore,
            scores: userScores,
        };
    });

    return ret;
}