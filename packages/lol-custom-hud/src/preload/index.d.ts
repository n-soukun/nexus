import { ElectronAPI } from "@electron-toolkit/preload";
import { HTTPServerStatus, HUDCustomize } from "src/types";

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getGameState: () => Promise<unknown>;
            onGameStateChange: (
                callback: (
                    event: Electron.IpcRendererEvent,
                    state: unknown,
                ) => void,
            ) => () => void;
            offGameStateChange: (
                callback: (
                    event: Electron.IpcRendererEvent,
                    state: unknown,
                ) => void,
            ) => void;
            getHUDCustomize: () => Promise<HUDCustomize>;
            setHUDCustomize: (data: HUDCustomize) => Promise<void>;
            openImageFileDialog: () => Promise<string | null>;
            restartHttpServer: (port: number) => Promise<boolean>;
            getHttpServerStatus: () => Promise<HTTPServerStatus>;
            onServerStatusChange: (
                callback: (
                    event: Electron.IpcRendererEvent,
                    status: HTTPServerStatus,
                ) => void,
            ) => () => void;
            offServerStatusChange: (
                callback: (
                    event: Electron.IpcRendererEvent,
                    status: HTTPServerStatus,
                ) => void,
            ) => void;
        };
    }
}
