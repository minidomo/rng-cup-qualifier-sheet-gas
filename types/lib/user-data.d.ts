declare namespace UserDataTypes {
    interface DiscordData {
        username: string,
    }

    interface OsuData {
        id: string,
        username: string,
        rank: string,
    }

    interface RegisteredUser {
        discord: DiscordData,
        osu: OsuData,
        badges: string,
        bws: string,
        tier: string,
    }
}