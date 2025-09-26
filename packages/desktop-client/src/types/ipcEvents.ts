import { GameStats, GameTime, HTTPServerStatus } from ".";

export enum IPCEvents {
    MainProcessLog = "main-process-log",
    GameStateChange = "game-state-changed",
    GameTimeChange = "game-time-changed",
    ServerStatusChange = "server-status-changed",
}

export type IPCEventsHandler<T extends IPCEvents> =
    T extends IPCEvents.MainProcessLog
        ? MainProcessLogEventHandler
        : T extends IPCEvents.GameStateChange
          ? GameStateChangeEventHandler
          : T extends IPCEvents.GameTimeChange
            ? GameTimeChangeEventHandler
            : T extends IPCEvents.ServerStatusChange
              ? ServerStatusChangeEventHandler
              : never;

export type IPCEventsPayload<T extends IPCEvents> =
    T extends IPCEvents.MainProcessLog
        ? MainProcessLogEventData
        : T extends IPCEvents.GameStateChange
          ? GameStats
          : T extends IPCEvents.GameTimeChange
            ? GameTime
            : T extends IPCEvents.ServerStatusChange
              ? HTTPServerStatus
              : never;

export type MainProcessLogEventData = {
    error: boolean;
    message: string;
};

export type MainProcessLogEventHandler = (
    event: Electron.IpcRendererEvent,
    log: MainProcessLogEventData,
) => void;

export type GameStateChangeEventHandler = (
    event: Electron.IpcRendererEvent,
    state: GameStats,
) => void;

export type GameTimeChangeEventHandler = (
    event: Electron.IpcRendererEvent,
    time: GameTime,
) => void;

export type ServerStatusChangeEventHandler = (
    event: Electron.IpcRendererEvent,
    status: HTTPServerStatus,
) => void;
