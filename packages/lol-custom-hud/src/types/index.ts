export interface FeatsProgress {
    firstBloods: number;
    firstBricks: boolean;
    killMonsters: number;
}

export interface TeamStats {
    kills: number;
    turrets: number;
    golds: string;
    killHordes: number;
    dragons: string[];
    killAtakhans: number;
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
    blueName: string;
    blueSubtitle: string;
    blueWins: number;
    blueLogo: string;
    redName: string;
    redSubtitle: string;
    redWins: number;
    redLogo: string;
}
