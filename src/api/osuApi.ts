// https://github.com/ppy/osu-api/wiki

namespace OsuApi {
    const { PROPERTIES } = Constants;
    const API_URL = 'https://osu.ppy.sh/api';

    function createUrl(baseUrl: string, params: Record<string, any>) {
        const searchParams = Object.keys(params)
            .map(e => `${e}=${params[e]}`)
            .join('&');
        const url = encodeURI(`${baseUrl}?${searchParams}`);
        return url;
    }

    function requestContent(endpoint: string, params: Record<string, any>) {
        const apiKey = PROPERTIES.getProperty('apikey');
        const url = createUrl(`${API_URL}${endpoint}`, {
            k: apiKey,
            ...params,
        });

        Utilities.sleep(HttpDelayManager.getHttpDelay()); // lessen api laod
        const requestData = UrlFetchApp.fetch(url);

        if (requestData.getResponseCode() === 200) {
            const content = requestData.getContentText('UTF-8');
            if (content) {
                return JSON.parse(content);
            }
        }

        return undefined;
    }

    export function getMatch(id: string): OsuApiTypes.MatchResponse | undefined {
        return requestContent('/get_match', { mp: id });
    }

    export function getBeatmaps(params: Partial<OsuApiTypes.BeatmapParams>): OsuApiTypes.BeatmapResponse[] | undefined {
        return requestContent('/get_beatmaps', params);
    }

    export function getUser(params: Partial<OsuApiTypes.UserParams>): OsuApiTypes.UserResponse | undefined {
        const content = requestContent('/get_user', params);
        return typeof content === 'undefined' ? undefined : content[0];
    }
}
