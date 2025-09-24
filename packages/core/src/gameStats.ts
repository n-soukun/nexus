import {
    Configuration,
    AllPlayersApi,
    EventsApi,
    GameApi,
} from "@lol-observer/leagoflegends-client";
import EventEmitter from "events";
import { GoldObserver, GoldObserverEvents } from "./goldObserver";

// オレオレ証明書を許可
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const BASE_URL = "https://127.0.0.1:2999";

const BaseConfig = new Configuration({ basePath: BASE_URL });

/** Events **/

export enum EventNames {
    GameStart = "GameStart",
    MinionsSpawning = "MinionsSpawning",
    FirstBlood = "FirstBlood",
    FirstBrick = "FirstBrick",
    TurretKilled = "TurretKilled",
    InhibKilled = "InhibKilled",
    DragonKill = "DragonKill",
    AtakhanKill = "AtakhanKill",
    HordeKill = "HordeKill",
    HeraldKill = "HeraldKill",
    BaronKill = "BaronKill",
    ChampionKill = "ChampionKill",
    Multikill = "Multikill",
    Ace = "Ace",
    TurretRespawned = "TurretRespawned",
    InhibRespawned = "InhibRespawned",
    GameEnd = "GameEnd",
}

export enum DragonTypes {
    Air = "Air",
    Earth = "Earth",
    Fire = "Fire",
    Water = "Water",
    Hextech = "Hextech",
    Chemtech = "Chemtech",
    Elder = "Elder",
}

export enum StolenValues {
    False = "False",
    True = "True",
}

export type Event<T extends EventNames = EventNames> =
    T extends EventNames.GameStart
        ? GameStartEvent
        : T extends EventNames.MinionsSpawning
          ? MinionsSpawningEvent
          : T extends EventNames.FirstBlood
            ? FirstBloodEvent
            : T extends EventNames.FirstBrick
              ? FirstBrickEvent
              : T extends EventNames.TurretKilled
                ? TurretKilledEvent
                : T extends EventNames.InhibKilled
                  ? InhibKilledEvent
                  : T extends EventNames.DragonKill
                    ? DragonKillEvent
                    : T extends EventNames.AtakhanKill
                      ? AtakhanKillEvent
                      : T extends EventNames.HordeKill
                        ? HordeKillEvent
                        : T extends EventNames.HeraldKill
                          ? HeraldKillEvent
                          : T extends EventNames.BaronKill
                            ? BaronKillEvent
                            : T extends EventNames.ChampionKill
                              ? ChampionKillEvent
                              : T extends EventNames.Multikill
                                ? MultiKillEvent
                                : T extends EventNames.Ace
                                  ? AceEvent
                                  : T extends EventNames.TurretRespawned
                                    ? TurretRespawnedEvent
                                    : T extends EventNames.InhibRespawned
                                      ? InhibRespawnedEvent
                                      : T extends EventNames.GameEnd
                                        ? GameEndEvent
                                        : never;

export type BaseEvent = {
    EventID: number;
    EventName: EventNames;
    EventTime: number;
};

export type GameStartEvent = BaseEvent & {
    EventName: EventNames.GameStart;
};

export type MinionsSpawningEvent = BaseEvent & {
    EventName: EventNames.MinionsSpawning;
};

export type FirstBloodEvent = BaseEvent & {
    EventName: EventNames.FirstBlood;
    Recipient: string;
};

export type FirstBrickEvent = BaseEvent & {
    EventName: EventNames.FirstBrick;
    KillerName: string;
};

export type TurretKilledEvent = BaseEvent & {
    EventName: EventNames.TurretKilled;
    TurretKilled: string;
    KillerName: string;
    Assisters: string[];
};

export type InhibKilledEvent = BaseEvent & {
    EventName: EventNames.InhibKilled;
    InhibKilled: string;
    KillerName: string;
    Assisters: string[];
};

export type DragonKillEvent = BaseEvent & {
    EventName: EventNames.DragonKill;
    DragonType: DragonTypes;
    Stolen: StolenValues;
    KillerName: string;
    Assisters: string[];
};

export type AtakhanKillEvent = BaseEvent & {
    EventName: EventNames.AtakhanKill;
    Stolen: StolenValues;
    KillerName: string;
    Assisters: string[];
};

export type HordeKillEvent = BaseEvent & {
    EventName: EventNames.HordeKill;
    Stolen: StolenValues;
    KillerName: string;
    Assisters: string[];
};

export type HeraldKillEvent = BaseEvent & {
    EventName: EventNames.HeraldKill;
    Stolen: StolenValues;
    KillerName: string;
    Assisters: string[];
};

export type BaronKillEvent = BaseEvent & {
    EventName: EventNames.BaronKill;
    Stolen: StolenValues;
    KillerName: string;
    Assisters: string[];
};

export type ChampionKillEvent = BaseEvent & {
    EventName: EventNames.ChampionKill;
    VictimName: string;
    KillerName: string;
    Assisters: string[];
};

export type MultiKillEvent = BaseEvent & {
    EventName: EventNames.Multikill;
    KillerName: string;
    KillStreak: number; // 2-5
};

export type AceEvent = BaseEvent & {
    EventName: EventNames.Ace;
    Acer: string;
    AcingTeam: TeamNames;
};

export type TurretRespawnedEvent = BaseEvent & {
    EventName: EventNames.TurretRespawned;
    TurretRespawned: string;
};

export type InhibRespawnedEvent = BaseEvent & {
    EventName: EventNames.InhibRespawned;
    InhibRespawned: string;
};

export type GameEndEvent = BaseEvent & {
    EventName: EventNames.GameEnd;
    Result: "Win" | "Lose";
};

export enum EventCollectionEvents {
    Update = "update",
    Change = "change",
    Connected = "connected",
    Disconnected = "disconnected",
}

export type EventCollectionEventsListener = {
    [EventCollectionEvents.Update]: (events: EventCollection) => void;
    [EventCollectionEvents.Change]: (
        oldEvents: Event[],
        newEvents: Event[],
    ) => void;
    [EventCollectionEvents.Connected]: () => void;
    [EventCollectionEvents.Disconnected]: () => void;
};

export class EventCollection {
    events: Event[];
    fetchInterval: number = 500;
    private conected: boolean = false;
    private intervalId?: NodeJS.Timer;
    private eventEmitter = new EventEmitter();
    private destroyed: boolean = false;

    constructor() {
        this.events = [];
        this.main();
    }

    on<T extends EventCollectionEvents>(
        event: T,
        listener: EventCollectionEventsListener[T],
    ) {
        this.eventEmitter.on(event, listener);
    }

    once<T extends EventCollectionEvents>(
        event: T,
        listener: EventCollectionEventsListener[T],
    ) {
        this.eventEmitter.once(event, listener);
    }

    off<T extends EventCollectionEvents>(
        event: T,
        listener: EventCollectionEventsListener[T],
    ) {
        this.eventEmitter.off(event, listener);
    }

    destory() {
        if (this.destroyed) return;
        if (this.intervalId) {
            clearInterval(Number(this.intervalId));
        }
        this.destroyed = true;
        this.intervalId = undefined;
        this.conected = false;
        this.eventEmitter.emit(EventCollectionEvents.Disconnected);
    }

    startSyncing() {
        if (!this.intervalId && !this.destroyed) {
            this.main();
        }
    }

    filterByName<T extends EventNames>(name: T): Event<T>[] {
        return this.events.filter((e) => e.EventName === name) as Event<T>[];
    }

    private main() {
        this.intervalId = setInterval(async () => {
            await this.fetchEvents().catch(() => {
                this.destory();
            });
        }, this.fetchInterval);
    }

    private fetchEvents = async () => {
        try {
            const eventsApi = new EventsApi(BaseConfig);
            const res = await eventsApi
                .getLiveclientdataEventdata()
                .catch((e) => {
                    throw new Error(e.response?.data || e.message);
                });
            const newEvents = res.data.Events as Event[];

            // 差分を比較
            if (JSON.stringify(this.events) !== JSON.stringify(newEvents)) {
                const oldEvents = this.events;
                this.events = newEvents;
                this.emitUpdate();
                this.emitChange(oldEvents, newEvents);
            }

            this.emitConnected();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    "Failed to fetch events from the League client API: " +
                        error.message,
                );
            } else {
                throw new Error(
                    "Failed to fetch events from the League client API.",
                );
            }
        }
    };

    private emitChange(oldEvents: Event[], newEvents: Event[]) {
        this.eventEmitter.emit(
            EventCollectionEvents.Change,
            oldEvents,
            newEvents,
        );
    }

    private emitUpdate() {
        this.eventEmitter.emit(EventCollectionEvents.Update, this);
    }

    private emitConnected() {
        if (!this.conected) {
            this.conected = true;
            this.eventEmitter.emit(EventCollectionEvents.Connected);
        }
    }
}

export enum TeamNames {
    ORDER = "ORDER",
    CHAOS = "CHAOS",
}

export interface CreatePlayerDataDTO {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: Item[];
    level: number;
    position: string;
    rawChampionName: string;
    respawnTimer: number;
    scores: Score;
    skinID: number;
    summonerName: string;
    riotId: string;
    riotIdGameName: string;
    riotIdTagLine: string;
    team: TeamNames;
}

export class PlayerData {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: Item[];
    level: number;
    position: string;
    rawChampionName: string;
    respawnTimer: number;
    scores: Score;
    skinID: number;
    summonerName: string;
    riotId: string;
    riotIdGameName: string;
    riotIdTagLine: string;
    team: TeamNames;

    private eventEmitter = new EventEmitter();

    constructor(data: CreatePlayerDataDTO) {
        this.championName = data.championName;
        this.isBot = data.isBot;
        this.isDead = data.isDead;
        this.items = data.items;
        this.level = data.level;
        this.position = data.position;
        this.rawChampionName = data.rawChampionName;
        this.respawnTimer = data.respawnTimer;
        this.scores = data.scores;
        this.skinID = data.skinID;
        this.summonerName = data.summonerName;
        this.riotId = data.riotId;
        this.riotIdGameName = data.riotIdGameName;
        this.riotIdTagLine = data.riotIdTagLine;
        this.team = data.team;
    }

    update(data: Partial<CreatePlayerDataDTO>) {
        // 変更点があれば更新してイベントを発火
        let updated = false;
        for (const key in data) {
            if (data[key as keyof CreatePlayerDataDTO] !== undefined) {
                if (
                    this[key as keyof CreatePlayerDataDTO] !==
                    data[key as keyof CreatePlayerDataDTO]
                ) {
                    (this as any)[key] = data[key as keyof CreatePlayerDataDTO];
                    updated = true;
                }
            }
        }
        if (updated) {
            this.emitUpdate();
        }
    }

    on(event: "update", listener: () => void) {
        this.eventEmitter.on(event, listener);
    }
    off(event: "update", listener: () => void) {
        this.eventEmitter.off(event, listener);
    }

    emitUpdate() {
        this.eventEmitter.emit("update");
    }
}

export interface CreatePlayerDTO {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: Item[];
    level: number;
    position: string;
    rawChampionName: string;
    respawnTimer: number;
    scores: Score;
    skinID: number;
    summonerName: string;
    riotId: string;
    riotIdGameName: string;
    riotIdTagLine: string;
    team: Team;
}

export class Player {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    items: Item[];
    level: number;
    position: string;
    rawChampionName: string;
    respawnTimer: number;
    scores: Score;
    skinID: number;
    summonerName: string;
    riotId: string;
    riotIdGameName: string;
    riotIdTagLine: string;
    team: Team;
    private playerData: PlayerData;
    private eventEmitter = new EventEmitter();

    constructor(data: PlayerData, team: Team) {
        this.championName = data.championName;
        this.isBot = data.isBot;
        this.isDead = data.isDead;
        this.items = data.items;
        this.level = data.level;
        this.position = data.position;
        this.rawChampionName = data.rawChampionName;
        this.respawnTimer = data.respawnTimer;
        this.scores = data.scores;
        this.skinID = data.skinID;
        this.summonerName = data.summonerName;
        this.riotId = data.riotId;
        this.riotIdGameName = data.riotIdGameName;
        this.riotIdTagLine = data.riotIdTagLine;
        this.team = team;
        this.playerData = data;
        this.playerData.on("update", () => this.update(this.playerData));
    }

    private update(data: PlayerData) {
        this.championName = data.championName;
        this.isBot = data.isBot;
        this.isDead = data.isDead;
        this.items = data.items;
        this.level = data.level;
        this.position = data.position;
        this.rawChampionName = data.rawChampionName;
        this.respawnTimer = data.respawnTimer;
        this.scores = data.scores;
        this.skinID = data.skinID;
        this.summonerName = data.summonerName;
        this.riotId = data.riotId;
        this.riotIdGameName = data.riotIdGameName;
        this.riotIdTagLine = data.riotIdTagLine;
        this.emitUpdate();
    }

    on(event: "update", listener: () => void) {
        this.eventEmitter.on(event, listener);
    }

    off(event: "update", listener: () => void) {
        this.eventEmitter.off(event, listener);
    }

    emitUpdate() {
        this.eventEmitter.emit("update");
    }
}

export enum PlayerCollectionEvents {
    Update = "update",
    Connected = "connected",
    Disconnected = "disconnected",
}

export class PlayerCollection {
    players: PlayerData[];
    fetchInterval: number = 500;
    private conected: boolean = false;
    private intervalId?: NodeJS.Timer;
    private eventEmitter = new EventEmitter();
    private destroyed: boolean = false;

    constructor() {
        this.players = [];
        this.main();
    }

    on(event: PlayerCollectionEvents, listener: () => void) {
        this.eventEmitter.on(event, listener);
    }

    once(event: PlayerCollectionEvents, listener: () => void) {
        this.eventEmitter.once(event, listener);
    }

    off(event: PlayerCollectionEvents, listener: () => void) {
        this.eventEmitter.off(event, listener);
    }

    destroy() {
        if (this.destroyed) return;
        if (this.intervalId) {
            clearInterval(Number(this.intervalId));
        }
        this.destroyed = true;
        this.intervalId = undefined;
        this.conected = false;
        this.eventEmitter.emit(PlayerCollectionEvents.Disconnected);
    }
    startSyncing() {
        if (!this.intervalId) {
            this.main();
        }
    }

    filterByTeam(team: Team): Player[] {
        return this.players
            .filter((p) => p.team === team.name)
            .map((p) => new Player(p, team));
    }

    private main() {
        this.intervalId = setInterval(async () => {
            await this.fetchPlayers().catch(() => {
                this.destroy();
            });
        }, this.fetchInterval);
    }

    private fetchPlayers = async () => {
        try {
            const allPlayersApi = new AllPlayersApi(BaseConfig);
            const res = await allPlayersApi
                .getLiveclientdataPlayerlist()
                .catch((e) => {
                    throw new Error(e.response?.data || e.message);
                });
            const newPlayers = res.data.map(
                (data: any) => new PlayerData(data),
            );

            // 差分を比較
            if (JSON.stringify(this.players) !== JSON.stringify(newPlayers)) {
                this.players = newPlayers;
                this.emitUpdate();
            }

            this.emitConnected();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    "Failed to fetch players from the League client API: " +
                        error.message,
                );
            } else {
                throw new Error(
                    "Failed to fetch players from the League client API.",
                );
            }
        }
    };

    private emitUpdate() {
        this.eventEmitter.emit(PlayerCollectionEvents.Update);
    }

    private emitConnected() {
        if (!this.conected) {
            this.conected = true;
            this.eventEmitter.emit(PlayerCollectionEvents.Connected);
        }
    }
}

export interface Score {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
}

export interface Item {
    canUse: boolean;
    consumable: boolean;
    count: number;
    displayName: string;
    itemID: number;
    price: number;
    rawDescription: string;
    rawDisplayName: string;
    slot: number;
}

export interface FeatsProgress {
    firstBloods: number;
    firstBricks: boolean;
    killMonsters: number;
}

export enum TeamEvents {
    Update = "update",
    FeatsAchieved = "featsAchieved",
}

export type TeamEventsListener = {
    [TeamEvents.Update]: (team: Team) => void;
    [TeamEvents.FeatsAchieved]: (team: Team) => void;
};

export class Team {
    name: TeamNames;
    kills: number = 0;
    killTurrets: number = 0;
    dragons: string[] = [];
    killAtakhans: number = 0;
    killHordes: number = 0;
    killHeralds: number = 0;
    killBarons: number = 0;
    featsProgress: FeatsProgress = {
        firstBloods: 0,
        firstBricks: false,
        killMonsters: 0,
    };
    players: Player[];
    game: Game;
    private _goldsRaw: string = "---";
    private _golds: string = "---";
    private events: EventCollection;
    private playerCollection: PlayerCollection;
    private goldObserver: GoldObserver;
    private eventEmitter = new EventEmitter();

    constructor(
        game: Game,
        name: TeamNames,
        players: PlayerCollection,
        events: EventCollection,
        goldObserver: GoldObserver,
    ) {
        this.game = game;
        this.name = name;
        this.goldObserver = goldObserver;
        this._golds =
            this.name === TeamNames.ORDER
                ? this.goldObserver.blueGold
                : this.goldObserver.redGold;
        this.playerCollection = players;
        this.events = events;
        this.events.on(
            EventCollectionEvents.Update,
            this.handleEventsUpdate.bind(this),
        );
        this.players = players.filterByTeam(this);
        this.playerCollection.on(
            PlayerCollectionEvents.Update,
            this.handlePlayersUpdate.bind(this),
        );
        this.goldObserver.on(
            GoldObserverEvents.GoldChange,
            this.handleGoldChange.bind(this),
        );
        this.goldObserver.on(
            GoldObserverEvents.Update,
            this.handleGoldRawUpdate.bind(this),
        );

        this.handleEventsUpdate(this.events);
        this.handlePlayersUpdate();
        this.handleGoldChange(
            this.goldObserver.blueGold,
            this.goldObserver.redGold,
        );
    }

    get golds() {
        return this._golds;
    }

    get goldsRaw() {
        return this._goldsRaw;
    }

    on<T extends TeamEvents>(event: T, listener: TeamEventsListener[T]) {
        this.eventEmitter.on(event, listener);
    }

    once<T extends TeamEvents>(event: T, listener: TeamEventsListener[T]) {
        this.eventEmitter.once(event, listener);
    }

    off<T extends TeamEvents>(event: T, listener: TeamEventsListener[T]) {
        this.eventEmitter.off(event, listener);
    }

    private emitUpdate() {
        this.eventEmitter.emit("update", this);
    }

    private updateStats(events: EventCollection) {
        let updated = false;

        // キル数
        const newKills = events
            .filterByName(EventNames.ChampionKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.kills !== newKills) {
            this.kills = newKills;
            updated = true;
        }

        // タワー破壊数
        const newKillTurrets = events
            .filterByName(EventNames.TurretKilled)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.killTurrets !== newKillTurrets) {
            this.killTurrets = newKillTurrets;
            updated = true;
        }

        // ドラゴンキル数と種類
        const newDragons = events
            .filterByName(EventNames.DragonKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            )
            .map((e) => e.DragonType);
        if (this.dragons.length !== newDragons.length) {
            this.dragons = newDragons;
            updated = true;
        }

        // アタカンキル数
        const newKillAtakhans = events
            .filterByName(EventNames.AtakhanKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.killAtakhans !== newKillAtakhans) {
            this.killAtakhans = newKillAtakhans;
            updated = true;
        }

        // ヴォイドグラブキル数
        const newKillHordes = events
            .filterByName(EventNames.HordeKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.killHordes !== newKillHordes) {
            this.killHordes = newKillHordes;
            updated = true;
        }

        // ヘラルドキル数
        const newKillHeralds = events
            .filterByName(EventNames.HeraldKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.killHeralds !== newKillHeralds) {
            this.killHeralds = newKillHeralds;
            updated = true;
        }

        // バロンキル数
        const newKillBarons = events
            .filterByName(EventNames.BaronKill)
            .filter((e) =>
                this.players.some((p) => p.riotIdGameName === e.KillerName),
            ).length;
        if (this.killBarons !== newKillBarons) {
            this.killBarons = newKillBarons;
            updated = true;
        }

        // 力の偉業進捗更新
        if (this.game.featsTeam === null) {
            // キル数
            this.featsProgress.firstBloods = Math.min(this.kills, 3);

            // 序盤モンスターキル数
            const killEarlyMonsters =
                Math.floor(newKillHordes / 3) +
                newDragons.length +
                newKillHeralds;

            this.featsProgress.killMonsters = Math.min(killEarlyMonsters, 3);

            // ファーストタワー確認
            if (this.featsProgress.firstBricks === false) {
                const event = events.filterByName(EventNames.FirstBrick)[0];
                if (
                    event &&
                    this.players.some(
                        (p) => p.riotIdGameName === event.KillerName,
                    )
                ) {
                    this.featsProgress.firstBricks = true;
                    updated = true;
                }
            }

            if (this.game.featsTeam === null && this.checkFeats()) {
                this.emitFeatsAchieved();
            }
        }

        if (updated) {
            this.emitUpdate();
        }
    }

    private checkFeats() {
        // 1. ファーストブラッド3回
        // 2. 序盤モンスターキル3回
        // 3. ファーストタワー破壊
        // このうち2つを達成で偉業達成
        if (
            (this.featsProgress.firstBloods >= 3 ? 1 : 0) +
                (this.featsProgress.killMonsters >= 3 ? 1 : 0) +
                (this.featsProgress.firstBricks ? 1 : 0) >=
            2
        ) {
            return true;
        }
        return false;
    }

    private emitFeatsAchieved() {
        this.eventEmitter.emit(TeamEvents.FeatsAchieved, this);
    }

    private handleEventsUpdate(events: EventCollection) {
        this.updateStats(events);
    }

    private handlePlayersUpdate() {
        this.players = this.playerCollection.filterByTeam(this);

        const itemsPriceSum = this.players.reduce((sum, player) => {
            const playerItemsPrice = player.items.reduce(
                (itemSum, item) => itemSum + item.price * item.count,
                0,
            );
            return sum + playerItemsPrice;
        }, 0);

        const newGolds = `${Math.floor(itemsPriceSum / 100) / 10}K`;

        if (
            this._golds === "" ||
            this.compareGolds(this._golds, newGolds) < 0
        ) {
            this._golds = newGolds;
            this.emitUpdate();
        }
    }

    private handleGoldChange(blueGold: string, redGold: string) {
        const next = this.name === TeamNames.ORDER ? blueGold : redGold;
        if (this._golds === "" || this.compareGolds(this._golds, next) < 0) {
            this._golds = next;
            this.emitUpdate();
        }
    }

    private handleGoldRawUpdate(blueGold: string, redGold: string) {
        const next = this.name === TeamNames.ORDER ? blueGold : redGold;
        if (this._goldsRaw !== next) {
            this._goldsRaw = next;
            this.emitUpdate();
        }
    }

    private compareGolds(a: string, b: string): number {
        // 最後のkを削除して数値に変換
        const numA = parseFloat(a.replace("K", ""));
        const numB = parseFloat(b.replace("K", ""));
        const result = numA - numB;
        return result;
    }
}

export interface CreateGameDTO {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
}

export enum GameOnlyEvents {
    EventOverride = "EventOverride", // 時間が巻き戻った場合等に全イベントを再送する
    EventUpdate = "EventUpdate", // イベントが更新された場合に発火
    Disconnected = "disconnected",
    Update = "Update",
}

export type GameEvents = EventNames | GameOnlyEvents;

export type GameEventsListener = {
    [K in EventNames]: (event: Event<K>) => void;
} & {
    [GameOnlyEvents.EventOverride]: (events: Event[]) => void;
    [GameOnlyEvents.EventUpdate]: (
        oldEvents: Event[],
        newEvents: Event[],
    ) => void;
    [GameOnlyEvents.Disconnected]: () => void;
    [GameOnlyEvents.Update]: (game: Game) => void;
};

export class Game {
    readonly teams: Record<TeamNames, Team>;
    readonly gameMode: string;
    readonly gameTime: number;
    readonly mapName: string;
    readonly mapNumber: number;
    readonly mapTerrain: string;
    fetchInterval: number = 100;
    private eventCollection: EventCollection;
    private _players: Player[];
    private playerCollection: PlayerCollection;
    private goldObserver: GoldObserver;
    private eventEmitter = new EventEmitter();
    private _disconnected: boolean = false;
    private intervalId?: NodeJS.Timer;
    private _featsTeam: TeamNames | null = null;

    static async checkGameAvailable(): Promise<boolean> {
        try {
            const gameApi = new GameApi(BaseConfig);
            await gameApi.getLiveclientdataGamestats();
            return true;
        } catch (error) {
            return false;
        }
    }

    static async connect(): Promise<Game> {
        return new Promise<Game>(async (resolve, reject) => {
            try {
                const gameApi = new GameApi(BaseConfig);
                const res = await gameApi.getLiveclientdataGamestats();
                const gameStats = res.data as CreateGameDTO;

                const events = new EventCollection();
                const players = new PlayerCollection();
                const goldObserver = new GoldObserver();

                let connectedCount = 0;

                const tryResolve = () => {
                    connectedCount++;
                    if (connectedCount === 3) {
                        resolve(
                            new Game(gameStats, players, events, goldObserver),
                        );
                    }
                };
                events.once(EventCollectionEvents.Connected, tryResolve);
                players.once(PlayerCollectionEvents.Connected, tryResolve);
                goldObserver.once(GoldObserverEvents.Connected, tryResolve);

                events.startSyncing();
                players.startSyncing();
                goldObserver.start();
                return new Game(gameStats, players, events, goldObserver);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(
                        "Failed to connect to the League of Legends client API." +
                            error.message,
                    );
                } else {
                    throw new Error(
                        "Failed to connect to the League of Legends client API.",
                    );
                }
            }
        });
    }

    constructor(
        data: CreateGameDTO,
        players: PlayerCollection,
        events: EventCollection,
        goldObserver: GoldObserver,
    ) {
        this.gameMode = data.gameMode;
        this.gameTime = data.gameTime;
        this.mapName = data.mapName;
        this.mapNumber = data.mapNumber;
        this.mapTerrain = data.mapTerrain;
        this.teams = {
            ORDER: new Team(
                this,
                TeamNames.ORDER,
                players,
                events,
                goldObserver,
            ),
            CHAOS: new Team(
                this,
                TeamNames.CHAOS,
                players,
                events,
                goldObserver,
            ),
        };

        this.eventEmitter = new EventEmitter();
        this.playerCollection = players;
        this.eventCollection = events;
        this.goldObserver = goldObserver;

        this._players = players
            .filterByTeam(this.teams.ORDER)
            .concat(players.filterByTeam(this.teams.CHAOS));

        this.playerCollection.on(
            PlayerCollectionEvents.Update,
            this.handlePlayersUpdate.bind(this),
        );
        this.eventCollection.on(
            EventCollectionEvents.Change,
            this.handleEventChange.bind(this),
        );

        this.teams.ORDER.on(TeamEvents.Update, () => this.emitUpdate());
        this.teams.ORDER.on(
            TeamEvents.FeatsAchieved,
            this.handleTeamFeatsAchieved.bind(this),
        );
        this.teams.CHAOS.on(TeamEvents.Update, () => this.emitUpdate());
        this.teams.CHAOS.on(
            TeamEvents.FeatsAchieved,
            this.handleTeamFeatsAchieved.bind(this),
        );

        this.eventCollection.on(
            EventCollectionEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );
        this.goldObserver.on(
            GoldObserverEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );
        this.playerCollection.on(
            PlayerCollectionEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );

        this.main();
    }

    get players(): Player[] {
        return this._players;
    }

    get events(): Event[] {
        return this.eventCollection.events;
    }

    get featsTeam(): TeamNames | null {
        return this._featsTeam;
    }

    get disconnected(): boolean {
        return this._disconnected;
    }

    destroy() {
        this.handleDisconnect();
    }

    on<T extends GameEvents>(event: T, listener: GameEventsListener[T]) {
        this.eventEmitter.on(event, listener);
    }

    once<T extends GameEvents>(event: T, listener: GameEventsListener[T]) {
        this.eventEmitter.once(event, listener);
    }

    off<T extends GameEvents>(event: T, listener: GameEventsListener[T]) {
        this.eventEmitter.off(event, listener);
    }

    private main() {
        this.intervalId = setInterval(async () => {
            await this.fetchGameStats().catch(() => {
                this.handleDisconnect();
            });
        }, this.fetchInterval);
    }

    private fetchGameStats = async () => {
        try {
            const gameApi = new GameApi(BaseConfig);
            const res = await gameApi
                .getLiveclientdataGamestats()
                .catch((e) => {
                    throw new Error(e.response?.data || e.message);
                });
            const gameStats = res.data as CreateGameDTO;

            let updated = false;
            if (this.gameMode !== gameStats.gameMode) {
                (this as any).gameMode = gameStats.gameMode;
                updated = true;
            }
            if (this.gameTime !== gameStats.gameTime) {
                (this as any).gameTime = gameStats.gameTime;
                updated = true;
            }
            if (this.mapName !== gameStats.mapName) {
                (this as any).mapName = gameStats.mapName;
                updated = true;
            }
            if (this.mapNumber !== gameStats.mapNumber) {
                (this as any).mapNumber = gameStats.mapNumber;
                updated = true;
            }
            if (this.mapTerrain !== gameStats.mapTerrain) {
                (this as any).mapTerrain = gameStats.mapTerrain;
                updated = true;
            }
            if (updated) {
                this.emitUpdate();
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    "Failed to fetch game stats from the League client API: " +
                        error.message,
                );
            } else {
                throw new Error(
                    "Failed to fetch game stats from the League client API.",
                );
            }
        }
    };

    private emitUpdate() {
        this.eventEmitter.emit(GameOnlyEvents.Update, this);
    }

    private handlePlayersUpdate() {
        this._players = [
            ...this.playerCollection.filterByTeam(this.teams.ORDER),
            ...this.playerCollection.filterByTeam(this.teams.CHAOS),
        ];
        this.emitUpdate();
    }

    private handleEventChange(oldEvents: Event[], newEvents: Event[]) {
        this.eventEmitter.emit(
            GameOnlyEvents.EventUpdate,
            oldEvents,
            newEvents,
        );

        // 巻き戻りや差分を検出してイベントを発火
        const oldLatestEvent = oldEvents[oldEvents.length - 1];
        const latestEvent = newEvents[newEvents.length - 1];
        if (
            oldLatestEvent &&
            latestEvent &&
            oldLatestEvent.EventID !== latestEvent.EventID
        ) {
            // 差分イベントを発火
            const diffEvents = newEvents.filter(
                (e) => e.EventID > oldLatestEvent.EventID,
            );
            diffEvents.forEach((e) => {
                this.eventEmitter.emit(e.EventName, e);
            });
        } else if (!oldLatestEvent && latestEvent) {
            // 最初のイベントを発火
            newEvents.forEach((e) => {
                this.eventEmitter.emit(e.EventName, e);
            });
        }
        // 巻き戻り検出
        if (
            oldLatestEvent &&
            latestEvent &&
            oldLatestEvent.EventID > latestEvent.EventID
        ) {
            this.eventEmitter.emit(GameOnlyEvents.EventOverride, newEvents);
        }
    }

    private handleTeamFeatsAchieved(team: Team) {
        if (this._featsTeam === null) {
            this._featsTeam = team.name;
            this.emitUpdate();
        }
    }

    private handleDisconnect() {
        if (this._disconnected) return;
        this._disconnected = true;

        if (this.intervalId) {
            clearInterval(Number(this.intervalId));
        }

        // リスナーを全て削除
        this.playerCollection.off(
            PlayerCollectionEvents.Update,
            this.handlePlayersUpdate.bind(this),
        );
        this.eventCollection.off(
            EventCollectionEvents.Change,
            this.handleEventChange.bind(this),
        );
        this.eventCollection.off(
            EventCollectionEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );
        this.goldObserver.off(
            GoldObserverEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );
        this.playerCollection.off(
            PlayerCollectionEvents.Disconnected,
            this.handleDisconnect.bind(this),
        );

        this.teams.ORDER.off(TeamEvents.Update, () => this.emitUpdate());
        this.teams.ORDER.off(
            TeamEvents.FeatsAchieved,
            this.handleTeamFeatsAchieved.bind(this),
        );
        this.teams.CHAOS.off(TeamEvents.Update, () => this.emitUpdate());
        this.teams.CHAOS.off(
            TeamEvents.FeatsAchieved,
            this.handleTeamFeatsAchieved.bind(this),
        );

        this.playerCollection.destroy();
        this.eventCollection.destory();
        this.goldObserver.destroy();

        this.eventEmitter.emit(GameOnlyEvents.Disconnected);
    }
}
