namespace OsuApiKeyManager {
    const { PROPERTIES, UI } = Constants;

    function isValidApiKey(key: string) {
        try {
            const url = `https://osu.ppy.sh/api/get_user?k=${key}&type=id&u=2`;
            const response = JSON.parse(UrlFetchApp.fetch(url).getContentText('UTF-8'));
            const error = response.error === 'Please provide a valid API key.';
            return !error;
        } catch (e) {
            return false;
        }
    }

    function apiKeyFlow() {
        const result = UI.prompt(
            'Please enter your osu! API key',
            "Create one using https://osu.ppy.sh/p/api if you don't have it",
            UI.ButtonSet.OK_CANCEL,
        );
        const text = result.getResponseText();

        // user pressed OK
        if (result.getSelectedButton() === UI.Button.OK) {
            if (isValidApiKey(text)) {
                PROPERTIES.setProperty('apikey', text);
                UI.alert('Your API key is working correctly and has been stored for use in this spreadsheet.');
            } else {
                UI.alert('Your API key did not work, please check that it is correct and try again.');
            }
        }
    }

    // Original code provided by LeoFLT, modified by minidomo
    export function showKeyStoringPrompt() {
        // check to see if an API key already exists
        if (PROPERTIES.getProperty('apikey')) {
            const response = UI.alert('An API key already exists, do you want to overwrite it?', UI.ButtonSet.YES_NO);
            if (response === UI.Button.YES) {
                apiKeyFlow();
            }
        } else {
            apiKeyFlow();
        }
    }

    export function removeKeyStoringPrompt() {
        const response = UI.alert('Are you sure you want to remove the stored API key?', UI.ButtonSet.YES_NO);
        if (response === UI.Button.YES) {
            PROPERTIES.deleteProperty('apikey');
            ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
            UI.alert('The API key has been removed successfully.');
        }
    }
}
