namespace Team {
    const { UI } = Constants;
    const { TEAMS_SHEET } = Constants.Sheets;

    export function create() {
        if (!TEAMS_SHEET) {
            UI.alert('No teams sheet found');
            return;
        }

        const evaluations = EvaluationData.getEvaluations();

        const topPlayerCount = 32;
        const tier1Usernames = evaluations
            .filter(e => e.tier === '1')
            .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
            .map(e => e.username)
            .slice(0, topPlayerCount);
        const tier2Usernames = evaluations
            .filter(e => e.tier === '2')
            .sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
            .map(e => e.username)
            .slice(0, topPlayerCount);

        const teams = formTeams(tier1Usernames, tier2Usernames);

        const rows = teams.map((row, i) => [i + 1, ...row]);
        TEAMS_SHEET.getRange('B3:F').clearContent();
        TEAMS_SHEET.getRange(3, 2, rows.length, rows[0].length).setValues(rows);
    }

    function formTeams(usernames1: string[], usernames2: string[]) {
        let u1 = usernames1.slice();
        let u2 = usernames2.slice();

        const teams: string[][] = [];

        const maxTeams = 16;
        const playersPerTier = 2;
        for (let i = 0; i < maxTeams; i++) {
            const team: string[] = [];

            for (let i = 0; i < playersPerTier; i++) {
                const username = randomElement(u1);
                team.push(username);
                u1 = u1.filter(e => e !== username);
            }

            for (let i = 0; i < playersPerTier; i++) {
                const username = randomElement(u2);
                team.push(username);
                u2 = u2.filter(e => e !== username);
            }

            teams.push(team);
        }

        return teams;
    }

    function randomElement<T>(arr: T[]) {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}
