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
