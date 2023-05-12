declare namespace GroupDataTypes {
    interface BeatmapData {
        id: string,
        mods: string[],
    }

    interface Group {
        beatmaps: BeatmapData[],
        matchIds: string[],
    }
}