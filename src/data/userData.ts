namespace UserData {
    const { SS } = Constants;

    export function getRegisteredUsers() {
        const rows = SS.getRange('Users!A2:G')
            .getValues()
            .filter(row => !RowUtil.isEmpty(row));
        const users = toRegisteredUsers(rows);
        return users;
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

    export function registeredUserToRow(user: UserDataTypes.RegisteredUser) {
        return [user.discord.username, user.osu.id, user.osu.username, user.osu.rank, user.badges, user.bws, user.tier];
    }
}
