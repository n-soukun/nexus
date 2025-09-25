import chalk from "chalk";
import { cursorTo } from "readline";
import {
    Game,
    Event,
    EventNames,
    GameOnlyEvents,
    TeamEvents,
    Team,
} from "@nexus/core";

let game: Game | null = null;

let consoleCursor = 0;

function fmtTime(second: number) {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    return `${min.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;
}

interface StructureData {
    type: string;
    team: string;
    lane: string;
    place: string;
}

function parseStructureName(name: string): StructureData | null {
    const arr = name.split("_");
    let type;
    let team;
    let lane;
    let place;
    if (arr[0] === "Turret") {
        type = "Truret";
    } else if (arr[0] === "Inhib") {
        type = "Inhibitor";
    } else {
        return null;
    }

    if (arr[1] === "TOrder") {
        team = "ORDER";
    } else if (arr[1] === "TChaos") {
        team = "CHAOS";
    } else {
        return null;
    }

    if (arr[2] === "L0") {
        lane = "Bot";
    } else if (arr[2] === "L1") {
        lane = "Mid";
    } else if (arr[2] === "L2") {
        lane = "Top";
    } else {
        return null;
    }

    if (arr[3] === "P3") {
        place = "Outer";
    } else if (arr[3] === "P2") {
        place = "Inner";
    } else if (arr[3] === "P1") {
        place = "Base";
    } else if (arr[3] === "P4" || arr[3] === "P5") {
        place = "Nexus";
    } else {
        return null;
    }

    if (type && team && lane && place) {
        return {
            type,
            team,
            lane,
            place,
        };
    } else {
        return null;
    }
}

function fmtName(name: string) {
    if (!game) return name;
    const player = game.players.find((p) => p.riotIdGameName === name);
    if (player) {
        if (player.team.name === "ORDER") {
            return chalk.blueBright(name);
        } else {
            return chalk.redBright(name);
        }
    } else {
        const structure = parseStructureName(name);
        if (structure) {
            let message = "";
            if (structure.place !== "Nexus") {
                if (structure.lane === "Bot") {
                    message += "ボット";
                } else if (structure.lane === "Mid") {
                    message += "ミッド";
                } else if (structure.lane === "Top") {
                    message += "トップ";
                }
                message += "の";
            }
            if (structure.type === "Inhibitor") {
                message += "インヒビター";
            } else {
                if (structure.place === "Outer") {
                    message += "アウター";
                } else if (structure.place === "Inner") {
                    message += "インナー";
                } else if (structure.place === "Base") {
                    message += "ベース";
                } else {
                    message += "ネクサス";
                }
                message += "タワー";
            }
            if (structure.team === "ORDER") {
                return chalk.blueBright(message);
            } else {
                return chalk.redBright(message);
            }
        } else if (name === "ORDER") {
            return chalk.blueBright("ブルーチーム");
        } else if (name === "CHAOS") {
            return chalk.redBright("レッドチーム");
        } else {
            return name;
        }
    }
}

function EventToMessage(event: Event) {
    let message = chalk.gray(fmtTime(event.EventTime)) + " ";
    switch (event.EventName) {
        case EventNames.GameStart:
            message += "ゲームが開始されました";
            break;
        case EventNames.MinionsSpawning:
            message += "ミニオンがスポーンしました";
            break;
        case EventNames.FirstBlood:
            message +=
                fmtName(event.Recipient) +
                "がファーストブラッドを達成しました！";
            break;
        case EventNames.FirstBrick:
            message +=
                fmtName(event.KillerName) +
                "がファーストタワーを達成しました！";
            break;
        case EventNames.TurretKilled:
            message +=
                fmtName(event.KillerName) +
                "が" +
                fmtName(event.TurretKilled) +
                "を破壊しました！";
            break;
        case EventNames.InhibKilled:
            message +=
                fmtName(event.KillerName) +
                "が" +
                fmtName(event.InhibKilled) +
                "を破壊しました！";
            break;
        case EventNames.DragonKill:
            message +=
                fmtName(event.KillerName) +
                "が" +
                event.DragonType +
                "ドラゴンを討伐しました！";
            break;
        case EventNames.AtakhanKill:
            message +=
                fmtName(event.KillerName) + "が呪縛のアタカンを討伐しました！";
            break;
        case EventNames.HordeKill:
            message +=
                fmtName(event.KillerName) + "がヴォイドクラブを討伐しました！";
            break;
        case EventNames.HeraldKill:
            message +=
                fmtName(event.KillerName) + "がリフトヘラルドを討伐しました！";
            break;
        case EventNames.BaronKill:
            message +=
                fmtName(event.KillerName) +
                "がバロンナッシャーを討伐しました！";
            break;
        case EventNames.ChampionKill:
            message +=
                fmtName(event.KillerName) +
                "が" +
                fmtName(event.VictimName) +
                "を倒しました！";
            break;
        case EventNames.Multikill:
            message +=
                fmtName(event.KillerName) +
                "が" +
                event.KillStreak +
                "連続キルを達成しました！";
            break;
        case EventNames.Ace:
            message += fmtName(event.AcingTeam) + "がエースを達成しました！";
            break;
        case EventNames.TurretRespawned:
            message += fmtName(event.TurretRespawned) + "がリスポーンしました";
            break;
        case EventNames.InhibRespawned:
            message += fmtName(event.InhibRespawned) + "がリスポーンしました";
            break;
        case EventNames.GameEnd:
            message +=
                event.Result === "Win"
                    ? "ゲームに勝利しました！"
                    : "ゲームに敗北しました...";
            break;
        default:
            message += "<不明なイベント>";
            break;
    }
    return message;
}

function createStateMessage(order: Team, chaos: Team) {
    if (!game) return;
    const blueGold = order.golds;
    const redGold = chaos.golds;
    return `${chalk.blueBright(
        "ブルーチーム",
    )} ${blueGold.toLocaleString()}G - ${redGold.toLocaleString()}G ${chalk.redBright(
        "レッドチーム",
    )}`;
}

async function writeEventLog(message: string) {
    if (!game) return;
    consoleCursor++;

    process.stdout.write("\x1b[2K\r");

    console.log(message);

    const stateMessage = createStateMessage(game.teams.ORDER, game.teams.CHAOS);

    process.stdout.write("\x1b[2K\r" + stateMessage);
}

function writeStateLog(order: Team, chaos: Team) {
    if (!game) return;
    const message = createStateMessage(order, chaos);
    if (!message) return;
    cursorTo(process.stdout, 0, consoleCursor);
    process.stdout.write("\x1b[2K\r" + message);
    cursorTo(process.stdout, 0, consoleCursor);
}

async function main() {
    if (game) {
        console.clear();
        const event = game.events;
        event.forEach((e) => {
            writeEventLog(EventToMessage(e));
        });
        Object.keys(EventNames).forEach((key) => {
            if (!game) return;
            const eventName = EventNames[key as keyof typeof EventNames];
            game.on(eventName, (e: Event) => {
                writeEventLog(EventToMessage(e));
            });
        });
        game.on(GameOnlyEvents.EventOverride, (events) => {
            console.clear();
            event.forEach((e) => {
                writeEventLog(EventToMessage(e));
            });
        });
        game.on(GameOnlyEvents.Disconnected, () => {
            game = null;
            main();
        });
        game.teams.ORDER.on(TeamEvents.Update, (order) => {
            writeStateLog(order, order.game.teams.CHAOS);
        });
        game.teams.CHAOS.on(TeamEvents.Update, (chaos) => {
            writeStateLog(chaos.game.teams.ORDER, chaos);
        });
    } else {
        console.clear();
        console.log("Waiting for game start...");
        for (;;) {
            const result = await Game.checkGameAvailable();
            if (result) {
                cursorTo(process.stdout, 0, 0);
                console.log("Connecting to game...");
                game = await Game.connect();
                console.log("Connected!");
                return main();
            }
        }
    }
}

main();
