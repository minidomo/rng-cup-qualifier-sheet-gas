function retrieveAllUserDataByUserId() {
    let ids = SS.getRange('Users!C3:C')
        .getValues()
        .filter(nonEmptyRow)
        .map(row => row[0].trim());

    let users = ids.map(id => getUserData({
        u: id,
        type: 'id',
    })).filter(e => e);

    updateAllUserData(users);
}

function retrieveAllUserDataByUsername() {
    let usernames = SS.getRange('Users!D3:D')
        .getValues()
        .filter(nonEmptyRow)
        .map(row => row[0].trim());

    let users = usernames.map(username => getUserData({
        u: username,
        type: 'string',
    })).filter(e => e);

    updateAllUserData(users);
}

function updateAllUserData(users) {
    if (users.length === 0) {
        UI.alert('No users found');
        return;
    }

    let rows = users.map(user => [user.user_id, user.username, user.pp_rank]);

    let sheet = SS.getSheetByName('Users');
    sheet.getRange(3, 3, rows.length, rows[0].length).setValues(rows);
}

function calculateUserStats() {
    let sheet = SS.getSheetByName('Users');

    let userInfo = sheet.getRange('E3:F').getValues();
    let rows = userInfo
        .map(row => {
            if (hasSomeEmpty(row)) {
                return ['', ''];
            }

            let variables = {
                rank: parseInt(row[0]),
                badges: parseInt(row[1]),
            };

            let bws = bwsFormula(variables);
            let tier = determineTier(bws);
            return [bws, tier];
        });

    sheet.getRange('G3:H').setValues(rows);
}

function bwsFormula(variables) {
    return Math.pow(variables.rank, Math.pow(.9, 2 * variables.badges));
}

function determineTier(bws) {
    if (bws < 1000) {
        return 'DQ';
    }

    if (1000 <= bws && bws < 10000) {
        return 1;
    }

    return 2;
}