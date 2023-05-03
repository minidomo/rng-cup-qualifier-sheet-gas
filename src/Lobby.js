function getAllSheetNames() {
    let arr = SS.getSheets()
        .map(e => e.getSheetName());
    return arr;
}

function createEmptyTable(rows, columns) {
    return Array(rows).fill(Array(columns).fill(''));
}

function generateLobbyId() {
    let LOBBY_SHEET_NAME_REGEX = /^L(\d+)/;

    let lobbyIdSet = new Set(
        getAllSheetNames()
            .map(e => {
                let match = e.match(LOBBY_SHEET_NAME_REGEX);

                if (!match) {
                    return null;
                }

                return parseInt(match[1]);
            })
            .filter(e => e !== null)
    );

    let id = 1;
    while (lobbyIdSet.has(id)) {
        id++;
    }

    return id;
}

function generateLobbyData(tier) {
    let id = generateLobbyId();
    let name = `L${id} - T${tier}`;

    let ret = {
        id,
        tier,
        name,
    };

    return ret;
}

function createLobbyTier1() {
    createLobby({
        tier: 1,
        numMaps: 7,
    });
}

function createLobbyTier2() {
    createLobby({
        tier: 2,
        numMaps: 9,
    });
}

function createLobby({
    tier,
    numMaps,
}) {
    let TEMPLATE_SHEET = SS.getSheetByName('Lobby - Template');
    let ID_RANGE = 'D2:E2';
    let TIER_RANGE = 'D3:E3';
    let MAPPOOL_RANGE = 'H3:J22';

    let lobbyData = generateLobbyData(tier);

    let sheet = TEMPLATE_SHEET.copyTo(SS);
    sheet.setName(lobbyData.name);

    let lobbyIdCell = sheet.getRange(ID_RANGE);
    lobbyIdCell.setValue(lobbyData.id);

    let tierCell = sheet.getRange(TIER_RANGE);
    tierCell.setValue(tier);

    let modPercentages = getModCombinationPercentages();
    let modStarRatings = getModStarRatings();
    let beatmapDataArr = [];

    for (let i = 0; i < numMaps; i++) {
        let data = generateBeatmapData(modPercentages, modStarRatings);
        beatmapDataArr.push(data);
    }

    let mappoolCells = sheet.getRange(MAPPOOL_RANGE);

    let values = createEmptyTable(mappoolCells.getNumRows(), mappoolCells.getNumColumns());
    for (let i = 0; i < beatmapDataArr.length; i++) {
        values[i] = beatmapDataArr[i].toLobbyRow();
    }

    mappoolCells.setValues(values);
}

function generateBeatmapData(modCombinationPercentages, modStarRatings) {
    let mods = randomMods(modCombinationPercentages);
    let starRating = determineModStarRating(modStarRatings, mods);
    let beatmap = findSingleBeatmap(starRating, mods);

    let ret = {
        beatmap,
        mods,
        toLobbyRow() {
            // some titles / diff names can include quotation marks so double them to have them display correctly
            // on google sheets
            // https://webapps.stackexchange.com/a/58018
            // example: https://osu.ppy.sh/beatmapsets/177585#osu/427962
            let mapTitle = `${beatmap.title} [${beatmap.version}]`.replace(/"/g, '""');
            let mapHyperlink = `=HYPERLINK("https://osu.ppy.sh/b/${beatmap.beatmap_id}","${mapTitle}")`;
            let mapCommand = `!mp map ${beatmap.beatmap_id} 0`;
            let modCommand = generateMpModsCommand(mods);

            return [mapHyperlink, mapCommand, modCommand];
        },
    };

    return ret;
}