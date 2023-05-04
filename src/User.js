function retrieveAllUserDataByUserId() {
    let ids = SS.getRange('Users!C3:C')
        .getValues()
        .filter(nonEmptyRows)
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
        .filter(nonEmptyRows)
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