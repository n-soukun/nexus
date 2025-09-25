import Store from "electron-store";
import {
    HTTPServerConfig,
    HUDCustomize,
    ThemeConfig,
    WindowState,
} from "../types";

interface StoreSchema {
    hudCustomize: HUDCustomize;
    windowState: WindowState;
    httpServerConfig: HTTPServerConfig;
    themeConfig: ThemeConfig;
}

const store = new Store<StoreSchema>({
    defaults: {
        hudCustomize: {
            tournamentRule: "bo3",
            tournamentLogo: "",
            blueName: "BLUE",
            blueSubtitle: "EMEA#1",
            blueWins: 0,
            blueLogo: "",
            redName: "RED",
            redSubtitle: "EMEA#2",
            redWins: 0,
            redLogo: "",
        },
        windowState: { x: 100, y: 100, width: 900, height: 670 },
        httpServerConfig: { port: 3000 },
        themeConfig: { themeId: "default" },
    },
});

export function getHUDCustomize(): HUDCustomize {
    return store.get("hudCustomize");
}

export function setHUDCustomize(hudCustomize: HUDCustomize): void {
    store.set("hudCustomize", hudCustomize);
}

export function getWindowState(): WindowState {
    return store.get("windowState");
}

export function setWindowState(windowState: WindowState): void {
    store.set("windowState", windowState);
}

export function getHTTPServerConfig(): HTTPServerConfig {
    return store.get("httpServerConfig");
}

export function setHTTPServerConfig(config: HTTPServerConfig): void {
    store.set("httpServerConfig", config);
}

export function getThemeConfig(): ThemeConfig {
    return store.get("themeConfig");
}

export function setThemeConfig(config: ThemeConfig): void {
    store.set("themeConfig", config);
}
