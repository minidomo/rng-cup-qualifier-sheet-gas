let GROUP_SHEET_NAME_REGEX = /^G(\d+)/;

function generateGroupId() {
    let idSet = new Set(
        getAllSheetNames()
            .map(e => {
                let match = e.match(GROUP_SHEET_NAME_REGEX);

                if (!match) {
                    return null;
                }

                return parseInt(match[1]);
            })
            .filter(e => e !== null)
    );

    let id = 1;
    while (idSet.has(id)) {
        id++;
    }

    return id;
}

function generateGroupData(tier) {
    let id = generateGroupId();
    let name = `G${id} - T${tier}`;

    let ret = {
        id,
        tier,
        name,
    };

    return ret;
}

function createGroupTier1() {
    createGroup({
        tier: 1,
        numMaps: 7,
    });
}

function createGroupTier2() {
    createGroup({
        tier: 2,
        numMaps: 9,
    });
}

function createGroup({
    tier,
    numMaps,
}) {
    let ID_RANGE = 'D2:E2';
    let TIER_RANGE = 'D3:E3';
    let MAPPOOL_RANGE = 'H3:J22';

    let groupData = generateGroupData(tier);

    let GROUP_TEMPLATE_SHEET = SS.getSheetByName('Group - Template');
    let sheet = GROUP_TEMPLATE_SHEET.copyTo(SS);
    sheet.setName(groupData.name);

    let groupIdCell = sheet.getRange(ID_RANGE);
    groupIdCell.setValue(groupData.id);

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

    let mappoolValues = createEmptyTable(mappoolCells.getNumRows(), mappoolCells.getNumColumns());
    for (let i = 0; i < beatmapDataArr.length; i++) {
        mappoolValues[i] = beatmapDataArr[i].toRow();
    }

    mappoolCells.setValues(mappoolValues);
}

function generateBeatmapData(modCombinationPercentages, modStarRatings) {
    let mods = randomMods(modCombinationPercentages);
    let starRating = determineModStarRating(modStarRatings, mods);
    let beatmap = findSingleBeatmap(starRating, mods);

    let ret = {
        beatmap,
        mods,
        toRow() {
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