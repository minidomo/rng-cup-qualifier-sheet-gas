let SS = SpreadsheetApp.getActiveSpreadsheet();
let UI = SpreadsheetApp.getUi();
let CACHE = CacheService.getDocumentCache();
let PROPERTIES = PropertiesService.getScriptProperties();
let SETTINGS = SS.getSheetByName('Settings');
let API_EXTRACT_SHEET = SS.getSheetByName('API Extraction');

// Adds extra menu
function onOpen(event) {
    UI.createMenu("Qualifiers")
        .addItem("Authorize scripts", "authorize")
        .addSubMenu(UI.createMenu("API Key")
            .addItem("Add API key", "showKeyStoringPrompt")
            .addItem("Remove API key", "removeKeyStoringPrompt")
        )
        .addSubMenu(UI.createMenu('Create group')
            .addItem('Tier 1', 'createGroupTier1')
            .addItem('Tier 2', 'createGroupTier2')
        )
        // .addSubMenu(UI.createMenu('Evaluation')
        //     .addItem('Tier 1', 'evaluateTier1')
        //     .addItem('Tier 2', 'evaluateTier2')
        // )
        // .addItem('Generate teams', 'createTeams')
        .addItem('Extract all match data', 'extractAllMatchData')
        .addItem('Debug', 'testdebug')
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
    let sheet = SS.getSheetByName('G1 - T1');
    let values = sheet.getRange('C14:C32').getValues();
    let ids = values
        .map(row => getMatchId(row[0].trim()))
        .filter(id => id);
    UI.alert(JSON.stringify(ids, null, 4));
}

function getAllSheetNames() {
    let arr = SS.getSheets()
        .map(e => e.getSheetName());
    return arr;
}

function createEmptyTable(rows, columns) {
    return Array(rows).fill(Array(columns).fill(''));
}