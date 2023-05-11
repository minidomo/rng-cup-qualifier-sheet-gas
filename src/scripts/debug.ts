namespace Debug {
    const { UI } = Constants;

    export function test() {
        const users = UserData.getRegisteredUsers();

        if (users.length === 0) {
            UI.alert('No users found');
            return;
        }

        const fixedUsers = uniqueUsers(users);

        UI.alert(`${users.length} | ${fixedUsers.length}`);
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
