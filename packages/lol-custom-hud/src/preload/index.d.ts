import { ElectronAPI } from "@electron-toolkit/preload";
import { HUDCustomize } from "src/types";

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
        };
    }
}
