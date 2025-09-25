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

export type HTTPServerStatus =
    | {
          running: true;
          port: number;
      }
    | {
          running: false;
          port: null;
      };

export interface HTTPServerConfig {
    port: number;
}

export interface ThemeConfig {
    themeId: string;
}

export interface ThemeManifestV1 {
    manifestVersion: 1;
    themeId: string;
    name: string;
    description?: string;
    thumbnail?: string;
    width: number;
    height: number;
    version: string;
    author?: string;
    authorUrl?: string;
    website?: string;
    license?: string;
    licenseUrl?: string;
}

export type AddThemeResult =
    | {
          result: true;
          theme: ThemeManifestV1;
          isVersionUp: boolean;
      }
    | { result: false; error: string };
