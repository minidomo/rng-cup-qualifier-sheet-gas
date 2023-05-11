declare namespace ScoreDataTypes {
    interface MatchData {
        name: string,
        id: string,
    }

    interface Score {
        match: MatchData,
        beatmapId: string,
        userId: string,
        score: string,
    }
}