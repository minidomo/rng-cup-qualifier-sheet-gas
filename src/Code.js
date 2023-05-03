let SS = SpreadsheetApp.getActiveSpreadsheet();
let UI = SpreadsheetApp.getUi();
let CACHE = CacheService.getDocumentCache();
let PROPERTIES = PropertiesService.getScriptProperties();
let SETTINGS = SS.getSheetByName('Settings');

// Adds extra menu
function onOpen(event) {
    UI.createMenu("Qualifiers")
        .addItem("Authorize scripts", "authorize")
        .addSubMenu(UI.createMenu("API Key")
            .addItem("Add API key", "showKeyStoringPrompt")
            .addItem("Remove API key", "removeKeyStoringPrompt")
        )
        .addSubMenu(UI.createMenu('Create lobby')
            .addItem('Tier 1', 'createLobbyTier1')
            .addItem('Tier 2', 'createLobbyTier2')
        )
        .addItem('debug', 'testdebug')
        .addToUi();
}

// The first time you run a menu function it doesn't actually execute the body
// after authorizing your Google account, you have to run it again to get the intended effect
// Many people get confused by this so I made this function
function authorize() {
    // Assuming this is the very first menu function you ever run on this
    // sheet, you'll have to authorize and the body isn't executed
    // Otherwise, the body *is* going to be run and tell you you're alraedy authorized
    UI.alert("You're already authorized");
}

function testdebug() {
    let modStarRatings = getModStarRatings();
    let modCombinations = getModCombinationPercentages();
    let ret = [];

    for (let i = 0; i < 10; i++) {
        let mods = randomMods(modCombinations);
        ret.push(generateMpModsCommand(mods));
    }

    UI.alert(JSON.stringify(ret, null, 4));
}