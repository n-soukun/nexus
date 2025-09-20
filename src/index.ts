import { Configuration } from "./generated/openapi";
import { AllPlayersApi, EventsApi, GameApi } from "./generated/openapi/api";
import { getTotalGold } from "./goldFetcher";
import {
    DragonKillEvent,
    Event,
    EventName,
    GameStats,
    Player,
    Team,
    TeamStats,
} from "./types";

// オレオレ証明書を許可
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const BASE_URL = "https://127.0.0.1:2999";

let players: Player[] = [];

function main() {
    setInterval(async () => {
        try {
            const gameStats = await getGameStats();
            if (players.length === 0) {
                await syncPlayerList();
            }
        } catch {
            console.clear();
            console.log("Game not started");
            return;
        }
        try {
            const events = await getEvents();
            const goldInfo = await getTotalGold();
            console.clear();
            events.slice(-5).forEach((e) => {
                console.log(e);
            });
            console.log("Gold Info:", goldInfo);
        } catch (e) {
            console.error("Error fetching events:", e);
        }
    }, 1_000);
}

async function getGameStats(): Promise<GameStats> {
    const configuration = new Configuration();
    const api = new GameApi(configuration, BASE_URL);
    const res = await api.getLiveclientdataGamestats();
    if (res.status !== 200) {
        throw new Error(
            `Failed to fetch game stats: ${res.status} ${res.statusText}`
        );
    }
    return res.data as GameStats;
}

async function getEvents(): Promise<Event[]> {
    const configuration = new Configuration();
    const api = new EventsApi(configuration, BASE_URL);
    const res = await api.getLiveclientdataEventdata();

    if (res.status !== 200) {
        throw new Error(
            `Failed to fetch events: ${res.status} ${res.statusText}`
        );
    }

    return res.data.Events;
}

async function getTeamStats(events: Event[]): Promise<{
    order: TeamStats;
    chaos: TeamStats;
}> {
    const orderPlayers = players.filter((p) => p.team === "ORDER");
    const chaosPlayers = players.filter((p) => p.team === "CHAOS");

    // キル数
    const championKillEvents = events.filter(
        (e) => e.EventName === "ChampionKill"
    );
    const orderKills = championKillEvents.filter((e) =>
        orderPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;
    const chaosKills = championKillEvents.filter((e) =>
        chaosPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;

    // タレット破壊数
    const TurretKilledEvents = events.filter(
        (e) => e.EventName === "TurretKilled"
    );
    const orderKillTurrets = TurretKilledEvents.filter((e) =>
        e.TurretKilled.includes("Chaos")
    ).length;
    const chaosKillTurrets = TurretKilledEvents.filter((e) =>
        e.TurretKilled.includes("Order")
    ).length;

    // ドラゴン討伐数と種類
    const dragonKillEvents = events.filter((e) => e.EventName === "DragonKill");
    const orderDragons = dragonKillEvents
        .filter((e) =>
            orderPlayers.some((p) => p.riotGameName === e.KillerName)
        )
        .map((e) => e.DragonType);
    const chaosDragons = dragonKillEvents
        .filter((e) =>
            chaosPlayers.some((p) => p.riotGameName === e.KillerName)
        )
        .map((e) => e.DragonType);

    // ヴォイドクラブ討伐数
    const hordeKillEvents = events.filter((e) => e.EventName === "HordeKill");
    const orderKillHordes = hordeKillEvents.filter((e) =>
        orderPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;
    const chaosKillHordes = hordeKillEvents.filter((e) =>
        chaosPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;

    // ヘラルド討伐数
    const heraldKillEvents = events.filter((e) => e.EventName === "HeraldKill");
    const orderKillHeralds = heraldKillEvents.filter((e) =>
        orderPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;
    const chaosKillHeralds = heraldKillEvents.filter((e) =>
        chaosPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;

    // バロン討伐数
    const baronKillEvents = events.filter((e) => e.EventName === "BaronKill");
    const orderKillBarons = baronKillEvents.filter((e) =>
        orderPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;
    const chaosKillBarons = baronKillEvents.filter((e) =>
        chaosPlayers.some((p) => p.riotGameName === e.KillerName)
    ).length;

    // ゴールド獲得数
    const goldInfo = await getTotalGold();
    const orderGold = goldInfo?.orderGold || "---";
    const chaosGold = goldInfo?.chaosGold || "---";

    return {
        order: {
            kills: orderKills,
            golds: orderGold,
            killTurrets: orderKillTurrets,
            Dragons: orderDragons,
            killHordes: orderKillHordes,
            killHeralds: orderKillHeralds,
            killBarons: orderKillBarons,
        },
        chaos: {
            kills: chaosKills,
            golds: chaosGold,
            killTurrets: chaosKillTurrets,
            Dragons: chaosDragons,
            killHordes: chaosKillHordes,
            killHeralds: chaosKillHeralds,
            killBarons: chaosKillBarons,
        },
    };
}

async function syncPlayerList() {
    const configuration = new Configuration();
    const api = new AllPlayersApi(configuration, BASE_URL);
    const res = await api.getLiveclientdataPlayerlist();
    if (res.status !== 200) {
        throw new Error(
            `Failed to fetch player list: ${res.status} ${res.statusText}`
        );
    }
    players = res.data.map((p: Player) => ({ riotId: p.riotId, team: p.team }));
}

main();
