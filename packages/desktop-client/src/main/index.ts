import {
    app,
    shell,
    BrowserWindow,
    ipcMain,
    dialog,
    Tray,
    Menu,
    nativeImage,
} from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { base64 } from "base64-img";

import type {
    HTTPServerStatus,
    HUDCustomize,
    AddThemeResult,
    AppearanceConfig,
} from "../types";
import { IPCEvents, type IPCEventsPayload } from "../types";
import icon from "../../resources/icon.png?asset";
import {
    getServerStatus,
    offServerStatusChange,
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
import { GameObserver, GameObserverEvents } from "./gameObserver";
import {
    getHTTPServerConfig,
    getHUDCustomize,
    getThemeConfig,
    getWindowState,
    setHTTPServerConfig,
    setHUDCustomize,
    setThemeConfig,
    setWindowState,
    getAppearanceConfig,
    setAppearanceConfig,
} from "./store";
import { adjustWindowStateToDisplays, getResourcePath } from "./utils";
import {
    addThemeFromZip,
    cancelVersionUp,
    completeVersionUp,
    deleteThemeById,
    getThemes,
} from "./theme";
import { Logger } from "./logger";

export const logger = new Logger();

// エラーハンドリング
process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    console.error("Uncaught Exception:", error);
});

// システムトレイ用
let tray: Tray;
const trayIcon = nativeImage.createFromPath(
    path.join(getResourcePath(), "icon.png"),
);

// ゲーム監視プロセス
export const gameObserver = new GameObserver();

function createWindow(): void {
    const beforeWindowState = adjustWindowStateToDisplays(getWindowState());
    const appearanceConfig = getAppearanceConfig();

    // Create the browser window.1
    const mainWindow = new BrowserWindow({
        x: beforeWindowState.x,
        y: beforeWindowState.y,
        width: beforeWindowState.width,
        height: beforeWindowState.height,
        minWidth: 480,
        minHeight: 320,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
        titleBarStyle: "hidden",
        titleBarOverlay: {
            color:
                appearanceConfig.colorMode === "light" ? "#f5f5f5" : "#121212",
            symbolColor:
                appearanceConfig.colorMode === "light" ? "#000" : "#fff",
            height: 48,
        },
    });

    // デバッグウィンドウを開く
    if (is.dev) {
        mainWindow.webContents.openDevTools();
    }

    // 読み込み後にウィンドウを表示
    mainWindow.webContents.once("did-finish-load", () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

    //---- IPC Event Senders ---- //

    // IPCイベントをレンダラーへ送信する関数
    // クライアントへ送信するイベントはすべてこれを使うこと
    const sendEvemtToRenderer = <T extends IPCEvents>(
        name: T,
        payload: IPCEventsPayload<T>,
    ): void => {
        mainWindow.webContents.send(name, payload);
    };

    logger.on("log", (log) => {
        sendEvemtToRenderer(IPCEvents.MainProcessLog, log);
    });

    const httpServerStatusHandler = (status: HTTPServerStatus): void => {
        sendEvemtToRenderer(IPCEvents.ServerStatusChange, status);
    };

    gameObserver.on(GameObserverEvents.GameStatsChange, (stats) => {
        sendEvemtToRenderer(IPCEvents.GameStateChange, stats!);
    });

    gameObserver.on(GameObserverEvents.GameTimeChange, (time) => {
        sendEvemtToRenderer(IPCEvents.GameTimeChange, time);
    });

    //---- HTTPサーバーの開始 ----//
    const httpServerStatus = getServerStatus();
    if (!httpServerStatus.running) {
        const httpServerConfig = getHTTPServerConfig();
        onServerStatusChange(httpServerStatusHandler);

        // 初回サーバー起動
        startServer(httpServerConfig.port)
            .then(() => {
                console.log("Server started");
            })
            .catch((err) => {
                console.error("Failed to start server:", err);
            });
    }

    //---- Websocketハンドラーの登録 ----//
    gameObserver.on(GameObserverEvents.GameStatsChange, (stats) => {
        sendMessage(SendMessageNames.GameStats, stats);
    });

    gameObserver.on(GameObserverEvents.GameTimeChange, (time) => {
        sendMessage(SendMessageNames.GameTime, time);
    });

    registerReceiveMessageHandler(
        ReceiveMessageNames.RequestCurrentData,
        (ws) => {
            sendMessage(
                SendMessageNames.GameStats,
                gameObserver.getGameStats(),
                ws,
            );
            sendMessage(
                SendMessageNames.GameTime,
                gameObserver.getGameTime(),
                ws,
            );
            sendMessage(SendMessageNames.HUDCustomize, getHUDCustomize(), ws);
        },
    );

    // ゲーム監視の開始
    gameObserver.start();

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

        // ハンドラー解除
        offServerStatusChange(httpServerStatusHandler);
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

async function handleOpenNewThemeDialog(): Promise<AddThemeResult> {
    const win = BrowserWindow.getAllWindows()[0];
    if (!win) {
        return { result: false, error: "ウィンドウが見つかりません。" };
    }

    const result = await dialog.showOpenDialog(win, {
        title: "テーマのzipファイルを選択",
        properties: ["openFile"],
        filters: [{ name: "Zip", extensions: ["zip"] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
        return { result: false, error: "キャンセルされました。" };
    }

    const zipPath = result.filePaths[0];
    return addThemeFromZip(zipPath);
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
        return gameObserver.getGameStats();
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

    ipcMain.handle("get-themes", async () => {
        return getThemes();
    });

    ipcMain.handle("set-theme", async (_event, themeId: string) => {
        setThemeConfig({ themeId });
        await restartHttpServer();
        return true;
    });

    ipcMain.handle("get-current-theme-id", async () => {
        const config = getThemeConfig();
        return config.themeId;
    });

    ipcMain.handle("open-new-theme-dialog", async () => {
        return handleOpenNewThemeDialog();
    });

    ipcMain.handle("continue-version-up", async () => {
        return completeVersionUp();
    });

    ipcMain.handle("cancel-version-up", async () => {
        return cancelVersionUp();
    });

    ipcMain.handle("delete-theme-by-id", async (_event, themeId: string) => {
        const currentThemeId = getThemeConfig().themeId;
        if (themeId === currentThemeId) {
            return false; // 使用中のテーマは削除できない
        }

        return deleteThemeById(themeId);
    });

    ipcMain.handle("get-appearance-config", async () => {
        return getAppearanceConfig();
    });

    ipcMain.handle(
        "set-appearance-config",
        async (_event, config: AppearanceConfig) => {
            setAppearanceConfig(config);
            return true;
        },
    );

    // Restart window handler (close and reopen window instead of restarting app)
    ipcMain.on("restart-app", () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            const currentWindow = windows[0];
            currentWindow.close();
            // Wait a bit before creating new window to ensure clean closure
            setTimeout(() => {
                createWindow();
            }, 100);
        }
    });

    createWindow();

    // システムトレイ
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "nuXusを開く",
            click: () => {
                const wins = BrowserWindow.getAllWindows();
                if (wins.length === 0) {
                    createWindow();
                } else {
                    wins[0].focus();
                }
            },
        },
        { role: "quit", label: "終了" },
    ]);
    tray.setContextMenu(contextMenu);

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
    // システムトレイへ常駐するためコメントアウト
    // if (process.platform !== "darwin") {
    //     app.quit();
    // }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
