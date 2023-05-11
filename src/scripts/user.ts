namespace User {
    const { UI } = Constants;
    const { USERS_SHEET } = Constants.Sheets;

    export function retrieveAllUserDataByUserId() {
        UI.alert('This script is being rewritten');
    }

    export function retrieveAllUserDataByUsername() {
        UI.alert('This script is being rewritten');
    }

    export function calculateUserStats() {
        UI.alert('This script is being rewritten');
    }

    export function removeDuplicateUsers() {
        const users = UserData.getRegisteredUsers();

        if (users.length === 0) {
            UI.alert('No users found');
            return;
        }

        const fixedUsers = uniqueUsers(users);
        const rows = fixedUsers.map(e => UserData.registeredUserToRow(e));

        USERS_SHEET?.getRange('A2:G').clearContent();
        USERS_SHEET?.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }

    function uniqueUsers(users: UserDataTypes.RegisteredUser[]) {
        const userIdSet = new Set();

        const ret = users.filter(user => {
            if (userIdSet.has(user.osu.id)) {
                return false;
            }

            userIdSet.add(user.osu.id);
            return true;
        });

        return ret;
    }
}
