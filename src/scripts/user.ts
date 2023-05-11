namespace User {
    const { UI } = Constants;
    const { USERS_SHEET } = Constants.Sheets;

    export function retrieveAllUserDataByUserId() {
        if (!USERS_SHEET) {
            UI.alert('No users sheet found');
            return;
        }

        const userIds = USERS_SHEET.getRange('B2:B')
            .getValues()
            .map(row => StringUtil.convert(row[0]))
            .filter(e => e !== '');

        if (userIds.length === 0) {
            UI.alert('No user ids found');
            return;
        }

        // user ids and their osu user data
        const userIdMap = createUserMap(userIds, 'id');

        // get osu related columns and update them
        updateOsuData(userIdMap, 0);
    }

    export function retrieveAllUserDataByUsername() {
        if (!USERS_SHEET) {
            UI.alert('No users sheet found');
            return;
        }

        const usernames = USERS_SHEET.getRange('C2:C')
            .getValues()
            .map(row => StringUtil.convert(row[0]))
            .filter(e => e !== '');

        if (usernames.length === 0) {
            UI.alert('No usernames found');
            return;
        }

        // usernames and their osu user data
        const usernameMap = createUserMap(usernames, 'string');

        // get osu related columns and update them
        updateOsuData(usernameMap, 1);
    }

    function createUserMap(values: string[], type: 'string' | 'id') {
        const map: Map<string, OsuApiTypes.UserResponse> = new Map();
        const checked: Set<string> = new Set();

        values.forEach(value => {
            if (checked.has(value)) {
                return;
            }

            const data = OsuApi.getUser({ u: value, type });
            if (data) {
                map.set(value, data);
            }

            checked.add(value);
        });

        return map;
    }

    function updateOsuData(map: Map<string, OsuApiTypes.UserResponse>, columnIndex: number) {
        if (!USERS_SHEET) {
            return;
        }

        const rows = USERS_SHEET.getRange('B2:D')
            .getValues()
            .map(row => {
                const key = StringUtil.convert(row[columnIndex]);
                const data = map.get(key);

                if (!data) {
                    return row;
                }

                return [data.user_id, data.username, data.pp_rank];
            });

        USERS_SHEET.getRange(2, 2, rows.length, rows[0].length).setValues(rows);
    }

    export function calculateUserStats() {
        UI.alert('This script is being rewritten');
    }

    export function removeDuplicateUsers() {
        if (!USERS_SHEET) {
            UI.alert('No users sheet found');
            return;
        }

        const users = UserData.getRegisteredUsers();

        if (users.length === 0) {
            UI.alert('No users found');
            return;
        }

        const fixedUsers = uniqueUsers(users);
        const rows = fixedUsers.map(e => UserData.registeredUserToRow(e));

        USERS_SHEET.getRange('A2:G').clearContent();
        USERS_SHEET.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
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
