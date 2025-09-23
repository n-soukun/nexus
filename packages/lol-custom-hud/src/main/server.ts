import { app } from "electron";
import express from "express";
import expressWs from "express-ws";
import path from "path";

import wsRouter from "./websocket";

const isDev = !app.isPackaged;

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
    return new Promise((resolve) => {
        const _app = express();
        const wsInstance = expressWs(_app);
        const app = wsInstance.app;

        app.use(express.static(getPublicPath())); // 静的ファイルを配信

        app.use("/ws", wsRouter); // WebSocketルーターを使用

        app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
            resolve(app);
        });
    });
}
