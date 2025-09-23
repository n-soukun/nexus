import { app } from "electron";
import express from "express";
import expressWs from "express-ws";
import path from "path";

import wsRouter from "./websocket";
import { Server } from "http";

const isDev = !app.isPackaged;

let server: Server | null = null;

export function getPublicPath(): string {
    if (isDev) {
        return path.join(__dirname, "../../resources/overlay");
    } else {
        return path.join(process.resourcesPath, "overlay");
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

    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
            resolve(app);
        });

        server.on("error", (err) => {
            reject(err);
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
            });
        } else {
            resolve();
        }
    });
}

export function getServerStatus(): { running: boolean; port: number | null } {
    if (server && server.listening) {
        const address = server.address();
        if (address && typeof address === "object") {
            return { running: true, port: address.port };
        }
        return { running: true, port: null };
    }
    return { running: false, port: null };
}
