import express from "express";
import expressWs from "express-ws";
import type { WebSocket as WsWebSocket } from "ws";
import { GameStats, GameTime, HUDCustomize } from "../types";

const _app = express();
const wsInstance = expressWs(_app);
const app = wsInstance.app;

const clients = new Set<WsWebSocket>();

//---- Send Message ----//

export enum SendMessageNames {
    GameTime = "game-time",
    GameStats = "game-stats",
    HUDCustomize = "hud-customize",
}

type BaseSendMessage = {
    type: SendMessageNames;
};

export type GameTimeMessage = BaseSendMessage & {
    type: SendMessageNames.GameTime;
    data: GameTime;
};

export type GameStatsMessage = BaseSendMessage & {
    type: SendMessageNames.GameStats;
    data: GameStats | null;
};

export type HUDCustomizeMessage = BaseSendMessage & {
    type: SendMessageNames.HUDCustomize;
    data: HUDCustomize;
};

export type Message<T extends SendMessageNames = SendMessageNames> =
    T extends SendMessageNames.GameTime
        ? GameTimeMessage
        : T extends SendMessageNames.GameStats
          ? GameStatsMessage
          : T extends SendMessageNames.HUDCustomize
            ? HUDCustomizeMessage
            : never;

export function sendMessage<T extends Message>(
    name: SendMessageNames,
    data: T["data"],
    ws?: WsWebSocket,
): void {
    const message: Message<typeof name> = {
        type: name,
        data,
    } as Message<typeof name>;
    const json = JSON.stringify(message);
    if (ws) {
        if (ws.readyState === 1) {
            ws.send(json);
        }
    } else {
        for (const client of clients) {
            if (client.readyState === 1) {
                client.send(json);
            }
        }
    }
}

//---- Receive Message ----//

export enum ReceiveMessageNames {
    RequestCurrentData = "request-current-data",
}

type BaseReceiveMessage = {
    type: ReceiveMessageNames;
    data?: unknown;
};

export type RequestCurrentDataMessage = BaseReceiveMessage & {
    type: ReceiveMessageNames.RequestCurrentData;
    data: undefined;
};

export type ReceiveMessage<
    T extends ReceiveMessageNames = ReceiveMessageNames,
> = T extends ReceiveMessageNames.RequestCurrentData
    ? RequestCurrentDataMessage
    : never;

const ReceiveMessageHandlers = new Map<
    ReceiveMessageNames,
    Array<(ws: WsWebSocket, data: unknown) => void>
>();

export function registerReceiveMessageHandler<T extends ReceiveMessageNames>(
    name: T,
    handler: ReceiveMessage<T>["data"] extends undefined
        ? (ws: WsWebSocket) => void
        : (ws: WsWebSocket, data: ReceiveMessage<T>["data"]) => void,
): void {
    const handlers = ReceiveMessageHandlers.get(name) || [];
    handlers.push(handler as (ws: WsWebSocket, data: unknown) => void);
    ReceiveMessageHandlers.set(name, handlers);
}

export function unregisterReceiveMessageHandler<T extends ReceiveMessageNames>(
    name: T,
    handler: ReceiveMessage<T>["data"] extends undefined
        ? (ws: WsWebSocket) => void
        : (ws: WsWebSocket, data: ReceiveMessage<T>["data"]) => void,
): void {
    const handlers = ReceiveMessageHandlers.get(name) || [];
    const index = handlers.indexOf(
        handler as (ws: WsWebSocket, data: unknown) => void,
    );
    if (index !== -1) {
        handlers.splice(index, 1);
        ReceiveMessageHandlers.set(name, handlers);
    }
}

app.ws("/", (ws) => {
    console.log("Client connected");
    clients.add(ws);
    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString()) as ReceiveMessage;
            const handlers = ReceiveMessageHandlers.get(data.type) || [];
            for (const handler of handlers) {
                handler(ws, data.data);
            }
        } catch (error) {
            console.error("Failed to handle message:", error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
        clients.delete(ws);
    });
    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
        clients.delete(ws);
    });
});

export default app;
