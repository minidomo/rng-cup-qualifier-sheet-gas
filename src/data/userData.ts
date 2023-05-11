namespace UserData {
    const { SS } = Constants;

    export function getRegisteredUsers() {
        const rows = SS.getRange('Users!A2:G').getValues()
            .filter(row => !RowUtil.isEmpty(row));
        const users = toRegisteredUsers(rows);
        const uniqueUsers = uniqueRegisteredUsers(users);
        return uniqueUsers;
    }

    function toRegisteredUsers(rows: any[][]) {
        const users = rows.map(row => {
            const user: UserDataTypes.RegisteredUser = {
                discord: {
                    username: StringUtil.convert(row[0]),
                },
                osu: {
                    id: StringUtil.convert(row[1]),
                    username: StringUtil.convert(row[2]),
                    rank: StringUtil.convert(row[3]),
                },
                badges: StringUtil.convert(row[4]),
                bws: StringUtil.convert(row[5]),
                tier: StringUtil.convert(row[6]),
            };

            return user;
        });

        return users;
    }

    function uniqueRegisteredUsers(users: UserDataTypes.RegisteredUser[]) {
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