const API_URL = "https://osu.ppy.sh/api";

// No caching needed since the amount of requests for qualifier sheets is very low
// If run *once* after all lobbies have concluded, then the number of requests will be the number of lobbies
function getMatchData(id) {
    const apiKey = PROPERTIES.getProperty("apikey");
    const baseUrl = createUrl(`${API_URL}/get_match`, {
        k: apiKey,
        mp: id,
    });
    return requestContent(baseUrl);
}

function requestContent(url) {
    Utilities.sleep(500); // lessen API load

    const requestData = UrlFetchApp.fetch(url);
    if (requestData.getResponseCode() == 200) {
        const content = requestData.getContentText("UTF-8");
        if (content) {
            return JSON.parse(content);
        }
    }

    return null;
}

function createUrl(baseUrl, params) {
    const searchParams = Object.keys(params).map(e => `${e}=${params[e]}`).join('&');
    const url = encodeURI(`${baseUrl}?${searchParams}`);
    return url;
}