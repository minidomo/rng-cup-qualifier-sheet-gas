namespace GroupEvaluation {
    const { UI, SS } = Constants;
    const { GROUP_EVALUATION_TEMPLATE_SHEET } = Constants.Sheets;

    export function showPrompt() {
        const result = UI.prompt('Enter the group id to make an evaluation sheet of.', UI.ButtonSet.OK_CANCEL);

        if (result.getSelectedButton() === UI.Button.CANCEL) {
            return;
        }

        const id = result.getResponseText().trim();
        const groupData = GroupData.getGroup(id);

        if (!groupData) {
            UI.alert(`No group found with id: ${id}`);
            return;
        }

        const mappoolMaps = makeMappool(groupData.beatmaps);
        const players = getPlayers(groupData.matchIds);

        const sheet = createSheet(id);

        if (!sheet) {
            return;
        }

        sheet.getRange('B2').setValue(`Group ${id}`);
        updateSheetMappool(sheet, mappoolMaps);
        updateSheetScores(sheet, players, mappoolMaps);
    }

    function updateSheetScores(
        sheet: GoogleAppsScript.Spreadsheet.Sheet,
        players: Player[],
        mappoolMaps: MappoolMap[],
    ) {
        const pickRow = mappoolMaps.map(e => `${e.pickMod}${e.pickId}`);

        const pickTopLeft = sheet.getRange('E5');
        if (!pickTopLeft) {
            return;
        }

        sheet.getRange(pickTopLeft.getRow(), pickTopLeft.getColumn(), 1, pickRow.length).setValues([pickRow]);

        const playerRows = players.map(player => {
            const matchId = player.scores[0]?.match.id ?? '0';
            const rankFormula = `=HYPERLINK("https://osu.ppy.sh/mp/${matchId}", "#${player.rank}")`;
            const nameFormula = `=HYPERLINK("https://osu.ppy.sh/u/${player.user.osu.id}", "${player.user.osu.username}")`;
            const averageScore = `${player.averageScore}`;
            const scores = mappoolMaps.map(e => player.scores.find(s => s.beatmapId === e.mapId)?.score ?? '');
            return [rankFormula, nameFormula, averageScore, ...scores];
        });

        const scoreTopLeft = sheet.getRange('B6');
        if (!scoreTopLeft) {
            return;
        }

        playerRows.forEach((row, i) => {
            sheet.getRange(scoreTopLeft.getRow() + i, scoreTopLeft.getColumn(), 1, row.length).setValues([row]);
        });
        sheet
            .getRange(scoreTopLeft.getRow(), scoreTopLeft.getColumn(), playerRows.length, 2)
            .setFontLines(Array(playerRows.length).fill(['none', 'none']));
    }

    function updateSheetMappool(sheet: GoogleAppsScript.Spreadsheet.Sheet, mappoolMaps: MappoolMap[]) {
        const rows = mappoolMaps.map(e => {
            const pick = `${e.pickMod}${e.pickId}`;
            const imageFormula = `=IMAGE("https://assets.ppy.sh/beatmaps/${e.setId}/covers/cover.jpg")`;

            const title = `${e.artist} - ${e.title} [${e.difficulty}]`.replace(/"/g, '""');
            const titleFormula = `=HYPERLINK("https://osu.ppy.sh/b/${e.mapId}", "${title}")`;

            const length = formatTime(Math.round(e.length));
            const mapper = e.mapper;
            const id = e.mapId;

            return [pick, imageFormula, titleFormula, e.sr, e.bpm, length, e.cs, e.ar, e.od, e.hp, mapper, id];
        });

        const topLeft = sheet.getRange('Z5');
        if (!topLeft) {
            return;
        }
        sheet.getRange(topLeft.getRow(), topLeft.getColumn(), rows.length, rows[0].length).setValues(rows);
        sheet
            .getRange(topLeft.getRow(), topLeft.getColumn() + 2, rows.length, 1)
            .setFontLines(Array(rows.length).fill(['none']));
    }

    function formatTime(seconds: number) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        const minString = `${min}`.padStart(2, '0');
        const secString = `${sec}`.padStart(2, '0');

        return `${minString}:${secString}`;
    }

    function createSheet(groupId: string) {
        if (!GROUP_EVALUATION_TEMPLATE_SHEET) {
            UI.alert('No evaluation template sheet found');
            return;
        }

        const sheetName = `GE${groupId}`;

        let sheet = SS.getSheetByName(sheetName);
        if (sheet) {
            SS.deleteSheet(sheet);
        }

        sheet = GROUP_EVALUATION_TEMPLATE_SHEET.copyTo(SS);
        sheet.setName(sheetName);

        return sheet;
    }

    function getPlayers(matchIds: string[]) {
        const scores = ScoreData.getScores().filter(e => matchIds.includes(e.match.id));
        const users = UserData.getRegisteredUsers();

        const players = users
            .filter(user => scores.filter(e => e.userId === user.osu.id).length > 0)
            .map(user => {
                const userScores = scores.filter(e => e.userId === user.osu.id);
                const averageScore = Math.floor(
                    userScores.reduce((prev, cur) => prev + parseInt(cur.score), 0) / userScores.length,
                );

                const player: Player = {
                    rank: 0, // placeholder
                    user,
                    averageScore,
                    scores: userScores,
                };

                return player;
            })
            .sort((a, b) => b.averageScore - a.averageScore);
        players.forEach((player, i) => (player.rank = i + 1));

        return players;
    }

    interface Player {
        rank: number;
        user: UserDataTypes.RegisteredUser;
        averageScore: number;
        scores: ScoreDataTypes.Score[];
    }

    function makeMappool(beatmaps: GroupDataTypes.BeatmapData[]) {
        const nextPickId: Map<string, number> = new Map();

        const mappool = beatmaps
            .map(beatmap => {
                let modsValue = 0;

                if (beatmap.mods.includes('DT')) {
                    modsValue |= 64;
                }

                if (beatmap.mods.includes('HR')) {
                    modsValue |= 16;
                }

                const res = OsuApi.getBeatmaps({ b: beatmap.id, mods: StringUtil.convert(modsValue) });
                if (!res || res.length !== 1) {
                    return;
                }

                const data = res[0];
                const attributes = adjustAttributes(
                    {
                        bpm: parseFloat(data.bpm),
                        length: parseFloat(data.hit_length),
                        cs: parseFloat(data.diff_size),
                        hp: parseFloat(data.diff_drain),
                        ar: parseFloat(data.diff_approach),
                        od: parseFloat(data.diff_overall),
                    },
                    beatmap.mods,
                );

                const pickMod = getPickMod(beatmap.mods);
                const pickId = nextPickId.get(pickMod) ?? 1;
                nextPickId.set(pickMod, pickId + 1);

                const map: MappoolMap = {
                    pickMod,
                    pickId,
                    setId: data.beatmapset_id,
                    mapId: data.beatmap_id,
                    mapper: data.creator,
                    artist: data.artist,
                    title: data.title,
                    difficulty: data.version,
                    sr: parseFloat(data.difficultyrating),
                    ...attributes,
                };

                return map;
            })
            .filter(e => typeof e !== undefined) as MappoolMap[];

        mappool.sort((a, b) => {
            const diff = comparePickMod(a.pickMod, b.pickMod);

            if (diff === 0) {
                return a.pickId - b.pickId;
            }

            return diff;
        });

        return mappool;
    }

    function comparePickMod(a: string, b: string) {
        const priority: Map<string, number> = new Map()
            .set('NM', 1)
            .set('HD', 2)
            .set('HR', 3)
            .set('DT', 4)
            .set('FM', 5)
            .set('HDDT', 6)
            .set('DTHR', 7);

        const valA = priority.get(a) ?? 10000;
        const valB = priority.get(b) ?? 10000;

        return valA - valB;
    }

    function getPickMod(mods: string[]) {
        if (mods.length === 0) {
            return 'FM';
        }

        const isDt = mods.includes('DT');
        const isHr = mods.includes('HR');
        const isHd = mods.includes('HD');

        if (isDt && isHr) {
            return 'DTHR';
        }

        if (isDt && isHd) {
            return 'HDDT';
        }

        if (isHd) {
            return 'HD';
        }

        if (isHr) {
            return 'HR';
        }

        if (isDt) {
            return 'DT';
        }

        return 'NM';
    }

    interface MappoolMap {
        pickMod: string;
        pickId: number;
        setId: string;
        mapId: string;
        mapper: string;
        artist: string;
        title: string;
        difficulty: string;
        sr: number;
        bpm: number;
        length: number;
        cs: number;
        ar: number;
        od: number;
        hp: number;
    }

    interface BeatmapAttributes {
        bpm: number;
        length: number;
        cs: number;
        ar: number;
        od: number;
        hp: number;
    }

    // referenced https://github.com/MaxOhn/rosu-pp/blob/68050f7848e0c197382663dfd081beef8d5b8fed/src/beatmap/attributes.rs
    function adjustAttributes<T extends Partial<BeatmapAttributes>>(attributes: T, mods: string[]) {
        const ret = Object.assign({}, attributes);
        const isDt = mods.includes('DT');
        const isHr = mods.includes('HR');

        if (typeof ret.bpm !== 'undefined') {
            if (isDt) {
                ret.bpm *= 1.5;
            }
        }

        if (typeof ret.length !== 'undefined') {
            if (isDt) {
                ret.length /= 1.5;
            }
        }

        if (typeof ret.cs !== 'undefined') {
            if (isHr) {
                ret.cs = Math.min(ret.cs * 1.3, 10);
            }
        }

        if (typeof ret.hp != 'undefined') {
            if (isHr) {
                ret.hp = Math.min(ret.hp * 1.4, 10);
            }
        }

        if (typeof ret.ar !== 'undefined') {
            let ar = ret.ar;

            if (isHr) {
                ar = Math.min(ar * 1.4, 10);
            }

            if (isDt) {
                const preempt = difficultyRange(ar, 1800, 1200, 450) / 1.5;
                if (preempt > 1200) {
                    ar = (1800 - preempt) / 120;
                } else {
                    ar = (1200 - preempt) / 150 + 5;
                }
            }

            ret.ar = ar;
        }

        if (typeof ret.od !== 'undefined') {
            let od = ret.od;

            if (isHr) {
                od = Math.min(od * 1.4, 10);
            }

            if (isDt) {
                const hitWindow = difficultyRange(od, 80, 50, 20) / 1.5;
                od = (80 - hitWindow) / 6;
            }

            ret.od = od;
        }

        return ret;
    }

    function difficultyRange(difficulty: number, min: number, mid: number, max: number) {
        if (difficulty > 5) {
            return mid + ((max - mid) * (difficulty - 5)) / 5;
        } else if (difficulty < 5) {
            return mid - ((mid - min) * (5 - difficulty)) / 5;
        } else {
            return mid;
        }
    }
}
