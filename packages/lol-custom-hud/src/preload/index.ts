import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { HUDCustomize } from "../types";

// Custom APIs for renderer
const api = {
    getGameState: () => ipcRenderer.invoke("get-game-state"),
    onGameStateChange: (
        callback: (event: Electron.IpcRendererEvent, state: unknown) => void,
    ) => {
        ipcRenderer.on("game-state-changed", callback);
        return () => {
            ipcRenderer.removeListener("game-state-changed", callback);
        };
    },
    offGameStateChange: (
        callback: (event: Electron.IpcRendererEvent, state: unknown) => void,
    ) => {
        ipcRenderer.removeListener("game-state-changed", callback);
    },

    getHUDCustomize: () => ipcRenderer.invoke("get-hud-customize"),
    setHUDCustomize: (data: HUDCustomize) =>
        ipcRenderer.invoke("set-hud-customize", data),
    openImageFileDialog: () => ipcRenderer.invoke("open-image-file-dialog"),
    restartHttpServer: (port: number) =>
        ipcRenderer.invoke("restart-http-server", port),
    getHttpServerStatus: () => ipcRenderer.invoke("get-http-server-status"),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
