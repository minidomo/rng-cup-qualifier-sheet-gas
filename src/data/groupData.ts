namespace GroupData {
    const { UI, SS } = Constants;

    export function getGroup(id: string) {
        const sheet = getGroupSheet(id);

        if (!sheet) {
            return null;
        }

        const matchIds = sheet
            .getRange('C14:C32')
            .getValues()
            .reduce((prev, cur) => prev.concat(cur), [])
            .map(e => StringUtil.convert(e))
            .map(parseMatchId)
            .filter(e => e !== null) as string[];

        const beatmaps = sheet
            .getRange('I3:J22')
            .getValues()
            .map(row => {
                const id = parseMapId(StringUtil.convert(row[0]));
                const mods = parseMods(StringUtil.convert(row[1]));

                if (!id) {
                    return null;
                }

                const beatmap: GroupDataTypes.BeatmapData = {
                    id,
                    mods,
                };

                return beatmap;
            })
            .filter(e => e !== null) as GroupDataTypes.BeatmapData[];

        const ret: GroupDataTypes.Group = {
            beatmaps,
            matchIds,
        };

        return ret;
    }

    function parseMapId(command: string) {
        const regex = /^!mp map (\d+) 0$/;
        const match = command.match(regex);
        return match ? match[1] : null;
    }

    function parseMods(command: string) {
        const regex = /[A-Z]{2}/g;
        const matches = command.match(regex) as string[] | null;
        return matches ?? [];
    }

    function parseMatchId(url: string) {
        const regex = /(\d+)$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function getGroupSheet(id: string) {
        const sheetName = SheetsUtil.getAllSheetNames().find(sheetName => {
            const regex = /^G(\d+)/;
            const match = sheetName.match(regex);

            if (!match) {
                return false;
            }

            return id === match[1];
        });

        if (!sheetName) {
            return null;
        }

        return SS.getSheetByName(sheetName);
    }
}
