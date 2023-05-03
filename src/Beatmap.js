function beatmapFilter(beatmap, targetStarRating) {
    const SR_ERROR = .2;
    const MAX_LENGTH = 380;
    const MIN_LENGTH = 180;

    if (beatmap.audio_unavailable !== '0') {
        return false;
    }

    if (beatmap.download_unavailable !== '0') {
        return false;
    }

    if (beatmap.approved !== '1') {
        return false;
    }

    if (Math.abs(beatmap.difficultyrating - targetStarRating) > SR_ERROR) {
        return false;
    }

    if (beatmap.total_length < MIN_LENGTH || beatmap.total_length > MAX_LENGTH) {
        return false;
    }

    return true;
}

function getClosestStarRatingBeatmap(beatmaps, targetStarRating) {
    if (beatmaps.length === 0) {
        return null;
    }

    return beatmaps.reduce((prev, cur) => {
        const diff1 = Math.abs(prev.difficultyrating - targetStarRating);
        const diff2 = Math.abs(cur.difficultyrating - targetStarRating);
        return diff1 < diff2 ? prev : cur;
    }, beatmaps[0]);
}

function findSingleBeatmap(targetStarRating, mods) {
    const BEATMAP_SEARCH_MAX_ATTEMPTS = 5;

    for (let i = 0; i < BEATMAP_SEARCH_MAX_ATTEMPTS; i++) {
        const leaderboardMaps = findLeaderboardBeatmaps(mods).filter(e => beatmapFilter(e, targetStarRating));
        const beatmap = getClosestStarRatingBeatmap(leaderboardMaps, targetStarRating);

        if (beatmap) {
            return beatmap;
        }
    }

    return null;
}

function findLeaderboardBeatmaps(mods) {
    const BEATMAP_SEARCH_RETURN_LIMIT = 500;
    const BEATMAP_SEARCH_REQUEST_PER_ATTEMPT = 2;

    const modValue = 0;
    if (mods.some(e => e === Mod.HR)) {
        modValue = Mod.HR;
    } else if (mods.some(e => e === Mod.DT)) {
        modValue = Mod.DT;
    }

    const apiKey = PROPERTIES.getProperty("apikey");
    const ret = [];

    for (let i = 0; i < BEATMAP_SEARCH_REQUEST_PER_ATTEMPT; i++) {
        const timestamp = generateTimestamp();
        const url = createUrl(`${API_URL}/get_beatmaps`, {
            k: apiKey,
            since: timestamp,
            limit: BEATMAP_SEARCH_RETURN_LIMIT,
            m: 0,
            mods: modValue,
        });

        const content = requestContent(url);
        ret.push(...content);
    }

    return ret;
}

function generateTimestamp() {
    const date = randomDate(new Date(2010, 0, 1, 0, 0, 0), new Date());

    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const second = `${date.getSeconds()}`.padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:${second}`;
}

function randomDate(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    return new Date(startTime + Math.random() * (endTime - startTime));
}