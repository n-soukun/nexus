import { ElectronAPI } from "@electron-toolkit/preload";
import {
    HTTPServerStatus,
    HUDCustomize,
    ThemeManifestV1,
    AppearanceConfig,
    AddThemeResult,
} from "src/types";
import { IPCEvents, IPCEventsHandler } from "../types";

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            ipcEvent: {
                on: <T extends IPCEvents>(
                    name: T,
                    callback: IPCEventsHandler<T>,
                ) => void;
                off: <T extends IPCEvents>(
                    name: T,
                    callback: IPCEventsHandler<T>,
                ) => void;
            };
            getAppVersion: () => Promise<string>;
            getGameState: () => Promise<unknown>;
            getHUDCustomize: () => Promise<HUDCustomize>;
            setHUDCustomize: (data: HUDCustomize) => Promise<void>;
            openImageFileDialog: () => Promise<string | null>;
            restartHttpServer: (port: number) => Promise<boolean>;
            getHttpServerStatus: () => Promise<HTTPServerStatus>;
            getThemes: () => Promise<ThemeManifestV1[]>;
            setTheme: (themeId: string) => Promise<boolean>;
            getCurrentThemeId: () => Promise<string>;
            openNewThemeDialog: () => Promise<AddThemeResult>;
            continueVersionUp: () => Promise<AddThemeResult>;
            cancelVersionUp: () => Promise<void>;
            deleteThemeById: (themeId: string) => Promise<boolean>;
            getAppearanceConfig: () => Promise<AppearanceConfig>;
            setAppearanceConfig: (config: AppearanceConfig) => Promise<boolean>;
        };
    }
}
