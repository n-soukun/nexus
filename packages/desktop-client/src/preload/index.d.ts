import { ElectronAPI } from "@electron-toolkit/preload";
import { HTTPServerStatus, HUDCustomize, ThemeManifestV1 } from "src/types";

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
            getThemes: () => Promise<ThemeManifestV1[]>;
            setTheme: (themeId: string) => Promise<boolean>;
            getCurrentThemeId: () => Promise<string>;
            openNewThemeDialog: () => Promise<AddThemeResult>;
            continueVersionUp: () => Promise<AddThemeResult>;
            cancelVersionUp: () => Promise<void>;
            deleteThemeById: (themeId: string) => Promise<boolean>;
        };
    }
}
