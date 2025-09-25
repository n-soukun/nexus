import { GameOnlyEvents, TeamEvents, Game } from "@nexus/core";
import { GameStats, GameTime } from "../types";
import EventEmitter from "events";

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
        return {
            blueTeam: {
                kills: this.game.teams.ORDER.kills,
                turrets: this.game.teams.ORDER.killTurrets,
                golds: this.game.teams.ORDER.golds,
                goldsRaw: this.game.teams.ORDER.goldsRaw,
                killHordes: this.game.teams.ORDER.killHordes,
                dragons: this.game.teams.ORDER.dragons,
                killAtakhans: this.game.teams.ORDER.killAtakhans,
                killHeralds: this.game.teams.ORDER.killHeralds,
                killBarons: this.game.teams.ORDER.killBarons,
                featsProgress: this.game.teams.ORDER.featsProgress,
            },
            redTeam: {
                kills: this.game.teams.CHAOS.kills,
                turrets: this.game.teams.CHAOS.killTurrets,
                golds: this.game.teams.CHAOS.golds,
                goldsRaw: this.game.teams.CHAOS.goldsRaw,
                killHordes: this.game.teams.CHAOS.killHordes,
                dragons: this.game.teams.CHAOS.dragons,
                killAtakhans: this.game.teams.CHAOS.killAtakhans,
                killHeralds: this.game.teams.CHAOS.killHeralds,
                killBarons: this.game.teams.CHAOS.killBarons,
                featsProgress: this.game.teams.CHAOS.featsProgress,
            },
        };
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
        this.main();
    }

    stop(): void {
        this.isRunning = false;
        this.game = null;
        this.emitStatsChange(null);
        this.emitTimeChange({ seconds: 0 });
    }

    private async main(): Promise<void> {
        if (game) {
            game.on(GameOnlyEvents.Update, (game) => {
                this.emitTimeChange({ seconds: game.gameTime });
            });
            game.teams.ORDER.on(TeamEvents.Update, (team) => {
                console.log("ORDER team updated");
                this.emitStatsChange(gameToGameStats(team.game));
            });
            game.teams.CHAOS.on(TeamEvents.Update, (team) => {
                this.emitStatsChange(gameToGameStats(team.game));
            });
            game.on(GameOnlyEvents.Disconnected, () => {
                console.log("Game disconnected");
                game = null;
                this.emitStatsChange(null);
                this.main();
            });
        } else {
            while (true) {
                if (!this.isRunning) {
                    return;
                }
                const result = await Game.checkGameAvailable();
                if (result) {
                    game = await Game.connect();
                    console.log("Game found:", game.gameMode);
                    this.emitStatsChange(gameToGameStats(game));
                    this.main();
                    break;
                }
            }
        }
    }

    private emitTimeChange(time: GameTime): void {
        this.eventEmitter.emit(GameObserverEvents.GameTimeChange, time);
    }

    private emitStatsChange(stats: GameStats | null): void {
        this.eventEmitter.emit(GameObserverEvents.GameStatsChange, stats);
    }
}

let game: Game | null = null;

function gameToGameStats(game: Game): GameStats {
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

export async function execute({
    onTimeChange,
    onStatsChange,
}: {
    onTimeChange: (seconds: GameTime) => void;
    onStatsChange: (stats: GameStats | null) => void;
}): Promise<void> {
    if (game) {
        game.on(GameOnlyEvents.Update, (game) => {
            onTimeChange({
                seconds: game.gameTime,
            });
        });
        game.teams.ORDER.on(TeamEvents.Update, (team) => {
            console.log("ORDER team updated");
            onStatsChange(gameToGameStats(team.game));
        });
        game.teams.CHAOS.on(TeamEvents.Update, (team) => {
            onStatsChange(gameToGameStats(team.game));
        });
        game.on(GameOnlyEvents.Disconnected, () => {
            console.log("Game disconnected");
            game = null;
            onStatsChange(null);
            execute({ onTimeChange, onStatsChange });
        });
    } else {
        while (true) {
            const result = await Game.checkGameAvailable();
            if (result) {
                game = await Game.connect();
                console.log("Game found:", game.gameMode);
                onStatsChange(gameToGameStats(game));
                execute({ onTimeChange, onStatsChange });
                break;
            }
        }
    }
}

export function getGameStats(): GameStats | null {
    if (game) {
        return gameToGameStats(game);
    } else {
        return null;
    }
}

export function getGameTime(): GameTime {
    if (game) {
        return {
            seconds: game.gameTime,
        };
    } else {
        return {
            seconds: 0,
        };
    }
}
