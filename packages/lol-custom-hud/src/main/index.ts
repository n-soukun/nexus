import { app, shell, BrowserWindow, ipcMain, dialog, screen } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { base64 } from "base64-img";
import type { WebSocket as WsWebSocket } from "ws";

import type {
    GameStats,
    GameTime,
    HTTPServerStatus,
    HUDCustomize,
    WindowState,
} from "../types";
import icon from "../../resources/icon.png?asset";
import {
    getServerStatus,
    onServerStatusChange,
    startServer,
    stopServer,
} from "./server";
import {
    ReceiveMessageNames,
    registerReceiveMessageHandler,
    sendMessage,
    SendMessageNames,
} from "./websocket";
import { execute, getGameStats, getGameTime } from "./gameObserver";
import {
    getHTTPServerConfig,
    getHUDCustomize,
    getWindowState,
    setHTTPServerConfig,
    setHUDCustomize,
    setWindowState,
} from "./store";

function handleReciveRequestCurrentData(ws: WsWebSocket): void {
    const stats = getGameStats();
    const time = getGameTime();
    if (stats) {
        sendMessage(SendMessageNames.GameStats, stats, ws);
        sendMessage(SendMessageNames.GameTime, time, ws);
    }
    const customize = getHUDCustomize();
    sendMessage(SendMessageNames.HUDCustomize, customize, ws);
}

// マルチモニター環境で保存済みウィンドウ位置・サイズを安全に復元する
function adjustWindowStateToDisplays(windowState: WindowState): WindowState {
    const defaultWindowState: WindowState = {
        x: 100,
        y: 100,
        width: 900,
        height: 670,
    };

    type Rect = { x: number; y: number; width: number; height: number };
    const isContainedIn = (rect: Rect, area: Rect): boolean =>
        rect.x >= area.x &&
        rect.y >= area.y &&
        rect.x + rect.width <= area.x + area.width &&
        rect.y + rect.height <= area.y + area.height;

    const intersectionArea = (a: Rect, b: Rect): number => {
        const ix = Math.max(a.x, b.x);
        const iy = Math.max(a.y, b.y);
        const ax = Math.min(a.x + a.width, b.x + b.width);
        const ay = Math.min(a.y + a.height, b.y + b.height);
        const iw = Math.max(0, ax - ix);
        const ih = Math.max(0, ay - iy);
        return iw * ih;
    };

    const clamp = (val: number, min: number, max: number): number =>
        Math.min(Math.max(val, min), max);

    const windowRect: Rect = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
    };

    const displays = screen.getAllDisplays();
    const workAreas: Rect[] = displays.map((d) => ({
        x: d.workArea.x,
        y: d.workArea.y,
        width: d.workArea.width,
        height: d.workArea.height,
    }));

    const containedIndex = workAreas.findIndex((area) =>
        isContainedIn(windowRect, area),
    );
    if (containedIndex >= 0) {
        return windowState; // どこかのディスプレイに完全に収まっている
    }

    // 交差面積最大のディスプレイを選択
    const scored = workAreas
        .map((area) => ({ area, score: intersectionArea(windowRect, area) }))
        .sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (!best || best.score === 0) {
        // 完全に画面外 -> 既定にリセット
        return { ...defaultWindowState };
    }

    // 最も交差しているディスプレイ内に収める
    const area = best.area;
    const newWidth = Math.min(windowRect.width, area.width);
    const newHeight = Math.min(windowRect.height, area.height);
    const newX = clamp(windowRect.x, area.x, area.x + area.width - newWidth);
    const newY = clamp(windowRect.y, area.y, area.y + area.height - newHeight);

    return { x: newX, y: newY, width: newWidth, height: newHeight };
}

function createWindow(): void {
    const beforeWindowState = adjustWindowStateToDisplays(getWindowState());

    // Create the browser window.1
    const mainWindow = new BrowserWindow({
        x: beforeWindowState.x,
        y: beforeWindowState.y,
        width: beforeWindowState.width,
        height: beforeWindowState.height,
        minWidth: 300,
        minHeight: 400,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color: "#121212",
            symbolColor: "#fff",
            height: 48,
        },
    });

    // デバッグウィンドウを開く
    if (is.dev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.once("did-finish-load", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    // HTTPサーバーの開始

    const httpServerConfig = getHTTPServerConfig();

    // 状態変更イベントのハンドラ登録
    const httpServerStatusHandler = (status: HTTPServerStatus): void => {
        mainWindow.webContents.send("server-status-changed", status);
    };
    onServerStatusChange(httpServerStatusHandler);

    // 初回サーバー起動
    startServer(httpServerConfig.port)
        .then(() => {
            console.log("Server started");
        })
        .catch((err) => {
            console.error("Failed to start server:", err);
        });

    // WebSocketメッセージハンドラ登録
    registerReceiveMessageHandler(
        ReceiveMessageNames.RequestCurrentData,
        handleReciveRequestCurrentData,
    );

    const sendStatsToClients = (stats: GameStats | null): void => {
        sendMessage(SendMessageNames.GameStats, stats);
        mainWindow.webContents.send("game-state-changed", stats);
    };

    const sendGameTimeToClients = (time: GameTime): void => {
        sendMessage(SendMessageNames.GameTime, time);
        mainWindow.webContents.send("game-time-changed", time);
    };

    // ゲーム監視の開始
    execute({
        onTimeChange: sendGameTimeToClients,
        onStatsChange: sendStatsToClients,
    }).catch((err) => {
        console.error("Failed to connect to game:", err);
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }

    mainWindow.on("close", () => {
        const bounds = mainWindow.getBounds();
        setWindowState({
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
        });
    });
}

function handleOpenImageFileDialog(): Promise<string | null> {
    return new Promise((resolve) => {
        dialog
            .showOpenDialog({
                title: "画像ファイルを選択",
                properties: ["openFile"],
                filters: [
                    {
                        name: "Images",
                        extensions: ["png", "jpg", "jpeg", "webp", "svg"],
                    },
                ],
            })
            .then((result: { canceled: boolean; filePaths: string[] }) => {
                if (result.canceled || result.filePaths.length === 0) {
                    resolve(null);
                } else {
                    const filePath = result.filePaths[0];
                    base64(filePath, (err, data) => {
                        if (err) {
                            console.error(
                                "Failed to convert image to base64:",
                                err,
                            );
                            resolve(null);
                        } else {
                            resolve(data);
                        }
                    });
                }
            })
            .catch((err: Error) => {
                console.error("Failed to open file dialog:", err);
                resolve(null);
            });
    });
}

async function restartHttpServer(): Promise<boolean> {
    const httpServerConfig = getHTTPServerConfig();
    try {
        await stopServer();
        await startServer(httpServerConfig.port);
        return true;
    } catch (error) {
        console.error("Failed to restart HTTP server:", error);
        return false;
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC Handlers
    ipcMain.on("ping", () => console.log("pong"));
    ipcMain.handle("get-game-state", () => {
        return getGameStats();
    });
    ipcMain.handle("get-hud-customize", async () => {
        return getHUDCustomize();
    });
    ipcMain.handle("set-hud-customize", async (_event, data: HUDCustomize) => {
        setHUDCustomize(data);
        sendMessage(SendMessageNames.HUDCustomize, data);
    });
    ipcMain.handle("open-image-file-dialog", async () => {
        return handleOpenImageFileDialog();
    });

    ipcMain.handle("restart-http-server", async (_event, port: number) => {
        setHTTPServerConfig({ port });
        return restartHttpServer();
    });

    ipcMain.handle("get-http-server-status", async () => {
        return getServerStatus();
    });

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
