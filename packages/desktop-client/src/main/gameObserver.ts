import EventEmitter from "events";
import { GameOnlyEvents, TeamEvents, Game } from "@nexus/core";
import { GameStats, GameTime } from "../types";

export enum GameObserverEvents {
    GameTimeChange = "game-time-changed",
    GameStatsChange = "game-stats-changed",
}

export type GameTimeChangeHandler = (time: GameTime) => void;
export type GameStatsChangeHandler = (stats: GameStats | null) => void;

export type GameObserverEventHandler<T extends GameObserverEvents> =
    T extends GameObserverEvents.GameTimeChange
        ? GameTimeChangeHandler
        : T extends GameObserverEvents.GameStatsChange
          ? GameStatsChangeHandler
          : never;

export class GameObserver {
    game: Game | null = null;
    private eventEmitter: EventEmitter;
    private isRunning = false;
    private waitForGameInterval: NodeJS.Timeout | null = null;
    private waitForGameIntervalMs = 1000;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    on<T extends GameObserverEvents>(
        event: T,
        handler: GameObserverEventHandler<T>,
    ): void {
        this.eventEmitter.on(event, handler);
    }

    off<T extends GameObserverEvents>(
        event: T,
        handler: GameObserverEventHandler<T>,
    ): void {
        this.eventEmitter.off(event, handler);
    }

    getGameStats(): GameStats | null {
        if (!this.game) {
            return null;
        }
        return this.gameToGameStats(this.game);
    }

    getGameTime(): GameTime {
        if (!this.game) {
            return {
                seconds: 0,
            };
        }
        return {
            seconds: this.game.gameTime,
        };
    }

    start(): void {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.waitForGame();
    }

    stop(): void {
        this.isRunning = false;
        this.game = null;
        this.stopWaitingForGame();
        this.emitStatsChange(null);
        this.emitTimeChange({ seconds: 0 });
    }

    private async waitForGame(): Promise<void> {
        if (!this.isRunning) return;
        if (this.waitForGameInterval) {
            clearInterval(this.waitForGameInterval);
        }
        this.waitForGameInterval = setInterval(async () => {
            const result = await Game.checkGameAvailable();
            if (result && !this.game) {
                try {
                    this.game = await Game.connect();
                    console.log("Game found:", this.game.gameMode);
                    this.emitStatsChange(this.gameToGameStats(this.game));
                    this.registerGameEvents();
                    this.stopWaitingForGame();
                } catch (error) {
                    console.error("Failed to connect to game:", error);
                    this.game = null;
                }
            }
        }, this.waitForGameIntervalMs);
    }

    private async stopWaitingForGame(): Promise<void> {
        if (this.waitForGameInterval) {
            clearInterval(this.waitForGameInterval);
            this.waitForGameInterval = null;
        }
    }

    private registerGameEvents(): void {
        if (!this.game) return;
        this.game.on(GameOnlyEvents.Update, (game) => {
            this.emitTimeChange({ seconds: game.gameTime });
        });
        this.game.teams.ORDER.on(TeamEvents.Update, (team) => {
            console.log("ORDER team updated");
            this.emitStatsChange(this.gameToGameStats(team.game));
        });
        this.game.teams.CHAOS.on(TeamEvents.Update, (team) => {
            this.emitStatsChange(this.gameToGameStats(team.game));
        });
        this.game.on(GameOnlyEvents.Disconnected, () => {
            console.log("Game disconnected");
            this.game = null;
            this.emitStatsChange(null);
            this.emitTimeChange({ seconds: 0 });
            this.waitForGame();
        });
    }

    private gameToGameStats(game: Game): GameStats {
        return {
            blueTeam: {
                kills: game.teams.ORDER.kills,
                turrets: game.teams.ORDER.killTurrets,
                golds: game.teams.ORDER.golds,
                goldsRaw: game.teams.ORDER.goldsRaw,
                killHordes: game.teams.ORDER.killHordes,
                dragons: game.teams.ORDER.dragons,
                killAtakhans: game.teams.ORDER.killAtakhans,
                killHeralds: game.teams.ORDER.killHeralds,
                killBarons: game.teams.ORDER.killBarons,
                featsProgress: game.teams.ORDER.featsProgress,
            },
            redTeam: {
                kills: game.teams.CHAOS.kills,
                turrets: game.teams.CHAOS.killTurrets,
                golds: game.teams.CHAOS.golds,
                goldsRaw: game.teams.CHAOS.goldsRaw,
                killHordes: game.teams.CHAOS.killHordes,
                dragons: game.teams.CHAOS.dragons,
                killAtakhans: game.teams.CHAOS.killAtakhans,
                killHeralds: game.teams.CHAOS.killHeralds,
                killBarons: game.teams.CHAOS.killBarons,
                featsProgress: game.teams.CHAOS.featsProgress,
            },
        };
    }

    private emitTimeChange(time: GameTime): void {
        this.eventEmitter.emit(GameObserverEvents.GameTimeChange, time);
    }

    private emitStatsChange(stats: GameStats | null): void {
        this.eventEmitter.emit(GameObserverEvents.GameStatsChange, stats);
    }
}
