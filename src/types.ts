export type Team = "ORDER" | "CHAOS";

export interface Player {
    championName: string;
    isBot: boolean;
    isDead: boolean;
    level: number;
    position: string;
    rawChampionName: string;
    respawnTimer: number;
    scores: Score;
    skinID: number;
    summonerName: string;
    riotId: string;
    riotGameName: string;
    riotIdTagLine: string;
    team: Team;
}

export interface Score {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
}

export interface GameStats {
    gameMode: string;
    gameTime: number;
    mapName: string;
    mapNumber: number;
    mapTerrain: string;
}

export interface TeamStats {
    kills: number;
    golds: string;
    killTurrets: number;
    Dragons: string[];
    killHordes: number;
    killHeralds: number;
    killBarons: number;
}

/** Events **/

export type EventName =
    | "GameStart"
    | "MinionsSpawning"
    | "FirstBrick"
    | "TurretKilled"
    | "InhibKilled"
    | "DragonKill"
    | "HordeKill"
    | "HeraldKill"
    | "BaronKill"
    | "ChampionKill"
    | "Multikill"
    | "Ace";

export type Event =
    | GameStartEvent
    | MinionsSpawningEvent
    | FirstBrickEvent
    | TurretKilledEvent
    | InhibKilledEvent
    | DragonKillEvent
    | HordeKillEvent
    | HeraldKillEvent
    | BaronKillEvent
    | ChampionKillEvent
    | MultiKillEvent
    | AceEvent;

export type BaseEvent = {
    EventID: number;
    EventName: EventName;
    EventTime: number;
};

export type GameStartEvent = BaseEvent & {
    EventName: "GameStart";
};

export type MinionsSpawningEvent = BaseEvent & {
    EventName: "MinionsSpawning";
};

export type FirstBrickEvent = BaseEvent & {
    EventName: "FirstBrick";
    KillerName: string;
};

export type TurretKilledEvent = BaseEvent & {
    EventName: "TurretKilled";
    TurretKilled: string;
    KillerName: string;
    Assisters: string[];
};

export type InhibKilledEvent = BaseEvent & {
    EventName: "InhibKilled";
    InhibKilled: string;
    KillerName: string;
    Assisters: string[];
};

export type DragonKillEvent = BaseEvent & {
    EventName: "DragonKill";
    DragonType: "Earth" | "Air" | "Fire" | "Water" | "Elder";
    Stolen: "False" | "True";
    KillerName: string;
    Assisters: string[];
};

export type HordeKillEvent = BaseEvent & {
    EventName: "HordeKill";
    Stolen: "False" | "True";
    KillerName: string;
    Assisters: string[];
};

export type HeraldKillEvent = BaseEvent & {
    EventName: "HeraldKill";
    Stolen: "False" | "True";
    KillerName: string;
    Assisters: string[];
};

export type BaronKillEvent = BaseEvent & {
    EventName: "BaronKill";
    Stolen: "False" | "True";
    KillerName: string;
    Assisters: string[];
};

export type ChampionKillEvent = BaseEvent & {
    EventName: "ChampionKill";
    VictimName: string;
    KillerName: string;
    Assisters: string[];
};

export type MultiKillEvent = BaseEvent & {
    EventName: "Multikill";
    KillerName: string;
    KillStreak: number; // 2-5
};

export type AceEvent = BaseEvent & {
    EventName: "Ace";
    Acer: string;
    AcingTeam: Team;
};
