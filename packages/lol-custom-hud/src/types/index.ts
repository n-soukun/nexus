export interface FeatsProgress {
    firstBloods: number;
    firstBricks: boolean;
    killMonsters: number;
}

export interface TeamStats {
    kills: number;
    turrets: number;
    golds: string;
    goldsRaw: string;
    dragons: string[];
    killAtakhans: number;
    killHordes: number;
    killHeralds: number;
    killBarons: number;
    featsProgress: FeatsProgress;
}

export interface GameStats {
    blueTeam: TeamStats;
    redTeam: TeamStats;
}

export interface GameTime {
    seconds: number;
}

export interface HUDCustomize {
    tournamentRule: "bo3" | "bo5";
    tournamentLogo: string;
    blueName: string;
    blueSubtitle: string;
    blueWins: number;
    blueLogo: string;
    redName: string;
    redSubtitle: string;
    redWins: number;
    redLogo: string;
}

export interface WindowState {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface HTTPServerStatus {
    running: boolean;
    port: number | null;
}

export interface HTTPServerConfig {
    port: number;
}
