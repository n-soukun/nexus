import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { HUDCustomize } from "../types";
import { IPCEvents, IPCEventsHandler } from "../types/ipcEvents";

// Custom APIs for renderer
const api = {
    ipcEvent: {
        on: <T extends IPCEvents>(name: T, callback: IPCEventsHandler<T>) => {
            ipcRenderer.on(name, callback);
        },
        off: <T extends IPCEvents>(name: T, callback: IPCEventsHandler<T>) => {
            ipcRenderer.removeListener(name, callback);
        },
    },
    getAppVersion: () => ipcRenderer.invoke("get-app-version"),
    getGameState: () => ipcRenderer.invoke("get-game-state"),
    getHUDCustomize: () => ipcRenderer.invoke("get-hud-customize"),
    setHUDCustomize: (data: HUDCustomize) =>
        ipcRenderer.invoke("set-hud-customize", data),
    openImageFileDialog: () => ipcRenderer.invoke("open-image-file-dialog"),
    restartHttpServer: (port: number) =>
        ipcRenderer.invoke("restart-http-server", port),
    getHttpServerStatus: () => ipcRenderer.invoke("get-http-server-status"),

    getThemes: () => ipcRenderer.invoke("get-themes"),
    setTheme: (themeId: string) => ipcRenderer.invoke("set-theme", themeId),
    getCurrentThemeId: () => ipcRenderer.invoke("get-current-theme-id"),
    openNewThemeDialog: () => ipcRenderer.invoke("open-new-theme-dialog"),
    continueVersionUp: () => ipcRenderer.invoke("continue-version-up"),
    cancelVersionUp: () => ipcRenderer.invoke("cancel-version-up"),
    deleteThemeById: (themeId: string) =>
        ipcRenderer.invoke("delete-theme-by-id", themeId),
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
