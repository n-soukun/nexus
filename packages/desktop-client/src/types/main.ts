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

export type MainProcessLogHandler = (
    event: Electron.IpcRendererEvent,
    log: { error: boolean; message: string },
) => void;
