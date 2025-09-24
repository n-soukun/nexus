import { app } from "electron";
import express from "express";
import expressWs from "express-ws";
import path from "path";

import wsRouter from "./websocket";
import { Server } from "http";
import { HTTPServerStatus } from "../types";

type ServerStatusChangeCallback = (status: HTTPServerStatus) => void;

const serverStatusChangeCallbacks = new Set<ServerStatusChangeCallback>();

export function onServerStatusChange(
    callback: ServerStatusChangeCallback,
): void {
    serverStatusChangeCallbacks.add(callback);
}

export function offServerStatusChange(
    callback: ServerStatusChangeCallback,
): void {
    serverStatusChangeCallbacks.delete(callback);
}

export function emitServerStatusChange(status: HTTPServerStatus): void {
    serverStatusChangeCallbacks.forEach((callback) => {
        callback(status);
    });
}

const isDev = !app.isPackaged;

let server: Server | null = null;

export function getPublicPath(): string {
    if (isDev) {
        return path.join(__dirname, "../../resources/overlay");
    } else {
        return path.join(
            process.resourcesPath,
            "app.asar.unpacked",
            "resources",
            "overlay",
        );
    }
}

export function startServer(
    port: number = 3000,
): Promise<expressWs.Application> {
    const _app = express();
    const wsInstance = expressWs(_app);
    const app = wsInstance.app;

    app.use(express.static(getPublicPath())); // 静的ファイルを配信

    app.use("/ws", wsRouter); // WebSocketルーターを使用

    app.get("/debug-info", (_req, res) => {
        res.json({
            status: "ok",
            timestamp: Date.now(),
            overlayPath: getPublicPath(),
        });
    });

    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
            resolve(app);
            emitServerStatusChange({ running: true, port: port });
        });

        server.on("error", (err) => {
            reject(err);
            server = null;
            emitServerStatusChange({ running: false, port: null });
        });
    });
}

export function stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (server) {
            server.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                    server = null;
                }
                emitServerStatusChange({ running: false, port: null });
            });
        } else {
            resolve();
        }
    });
}

export function getServerStatus(): HTTPServerStatus {
    if (server && server.listening) {
        const address = server.address();
        if (address && typeof address === "object") {
            return { running: true, port: address.port };
        }
        throw new Error("サーバーのアドレス情報が取得できません");
    }
    return { running: false, port: null };
}
