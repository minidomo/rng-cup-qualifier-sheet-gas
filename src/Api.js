let API_URL = "https://osu.ppy.sh/api";

// https://github.com/ppy/osu-api/wiki

// No caching needed since the amount of requests for qualifier sheets is very low
// If run *once* after all lobbies have concluded, then the number of requests will be the number of lobbies
function getMatchData(id) {
    let apiKey = PROPERTIES.getProperty("apikey");
    let baseUrl = createUrl(`${API_URL}/get_match`, {
        k: apiKey,
        mp: id,
    });
    return requestContent(baseUrl);
}

function requestContent(url) {
    Utilities.sleep(500); // lessen API load

    let requestData = UrlFetchApp.fetch(url);
    if (requestData.getResponseCode() == 200) {
        let content = requestData.getContentText("UTF-8");
        if (content) {
            return JSON.parse(content);
        }
    }

    return null;
}

function createUrl(baseUrl, params) {
    let searchParams = Object.keys(params).map(e => `${e}=${params[e]}`).join('&');
    let url = encodeURI(`${baseUrl}?${searchParams}`);
    return url;
}