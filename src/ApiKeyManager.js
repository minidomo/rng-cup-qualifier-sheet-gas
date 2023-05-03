// Code provided by LeoFLT
function showKeyStoringPrompt() {
    function apiKeyFlow() {
        const result = UI.prompt(
            "Please enter your osu! API key",
            "Create one using https://osu.ppy.sh/p/api if you don't have it",
            UI.ButtonSet.OK_CANCEL
        );
        const text = result.getResponseText();

        // user pressed OK
        if (result.getSelectedButton() === UI.Button.OK) {
            try {
                requestContent(`https://osu.ppy.sh/api/get_user?k=${text}&type=id&u=2`);
                PROPERTIES.setProperty("apikey", text);
                UI.alert('Your API key is working correctly and has been stored for use in this spreadsheet.');
            } catch (e) {
                UI.alert('Your API key did not work, please check that it is correct and try again.');
            }
        }
    }
    // check to see if an API key already exists
    if (PROPERTIES.getProperty("apikey")) {
        let response = UI.alert("An API key already exists, do you want to overwrite it?", UI.ButtonSet.YES_NO);
        if (response === UI.Button.YES)
            apiKeyFlow();
    } else
        apiKeyFlow();
}

function removeKeyStoringPrompt() {
    let response = UI.alert("Are you sure you want to remove the stored API key?", UI.ButtonSet.YES_NO);
    if (response === UI.Button.YES) {
        PROPERTIES.deleteProperty("apikey");
        ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t))
        UI.alert("The API key has been removed successfully.");
    }
}