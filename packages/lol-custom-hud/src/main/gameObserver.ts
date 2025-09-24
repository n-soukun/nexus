import { GameOnlyEvents, TeamEvents, Game } from "@lol-observer/core";
import { GameStats, GameTime } from "../types";

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
