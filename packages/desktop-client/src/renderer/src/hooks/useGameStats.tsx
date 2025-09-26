import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

import type { GameStats } from "../../../types";
import { IPCEvents } from "../../../types";

export interface GameStatsContextValue {
    gameStats: GameStats | null;
}

const _GameStatsContext = createContext<GameStatsContextValue>(null!);

// eslint-disable-next-line react/prop-types
export const GameStatsContext: React.FC<PropsWithChildren> = ({ children }) => {
    const [gameStats, setGameStats] = useState<GameStats | null>(null);

    useEffect(() => {
        const handler = (): void => {
            console.log("Game state changed");
            window.api.getGameState().then((state) => {
                setGameStats(state as GameStats);
            });
        };

        handler();
        window.api.ipcEvent.on(IPCEvents.GameStateChange, handler);
        return () => {
            window.api.ipcEvent.off(IPCEvents.GameStateChange, handler);
        };
    }, []);

    return (
        <_GameStatsContext.Provider
            value={{
                gameStats,
            }}
        >
            {children}
        </_GameStatsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameStats = (): GameStatsContextValue => {
    const context = useContext(_GameStatsContext);
    if (!context) {
        throw new Error("useResources must be used within a DVDInfoProvider");
    }
    return context;
};
