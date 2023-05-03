function getAllSheetNames() {
    const arr = SS.getSheets()
        .map(e => e.getSheetName());
    return arr;
}

function generateLobbyId() {
    const LOBBY_SHEET_NAME_REGEX = /^L(\d+)/;

    const lobbyIdSet = new Set(
        getAllSheetNames()
            .map(e => {
                const match = e.match(LOBBY_SHEET_NAME_REGEX);

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
    const id = generateLobbyId();
    const name = `L${id} - T${tier}`;

    const ret = {
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
    const TEMPLATE_SHEET = SS.getSheetByName('Template');
    const ID_RANGE = 'D2:E2';
    const TIER_RANGE = 'D3:E3';
    const MAP_RANGE = 'H3';

    const lobbyData = generateLobbyData(tier);

    const sheet = TEMPLATE_SHEET.copyTo(SS);
    sheet.setName(lobbyData.name);

    const lobbyIdCell = sheet.getRange(ID_RANGE);
    lobbyIdCell.setValue(lobbyData.id);

    const tierCell = sheet.getRange(TIER_RANGE);
    tierCell.setValue(tier);

    /*
    generate mod
    get desired star rating
    find beatmap with mod and star rating
    */
    const beatmap = findSingleBeatmap(6.0, [Mod.HD]);
    const mapCell = sheet.getRange(MAP_RANGE);
    mapCell.setValue(beatmap.beatmap_id);
}
