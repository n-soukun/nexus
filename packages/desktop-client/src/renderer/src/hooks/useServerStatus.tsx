import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

import type { HTTPServerStatus } from "../../../types";

export interface ServerStatusContextValue {
    readonly serverStatus: HTTPServerStatus | null;
    syncServerStatus: () => Promise<void>;
}

const _ServerStatusContext = createContext<ServerStatusContextValue>(null!);

export const ServerStatusContext: React.FC<PropsWithChildren> = ({
    // eslint-disable-next-line react/prop-types
    children,
}) => {
    const [serverStatus, setServerStatus] = useState<HTTPServerStatus | null>(
        null,
    );

    useEffect(() => {
        const handler = (_event: unknown, status: HTTPServerStatus): void => {
            setServerStatus(status);
        };

        window.api.onServerStatusChange(handler);
        syncServerStatus(); // 初回同期
        return () => {
            window.api.offServerStatusChange(handler);
        };
    }, []);

    const syncServerStatus = async (): Promise<void> => {
        const status = await window.api.getHttpServerStatus();
        setServerStatus(status);
    };

    const value = {
        serverStatus,
        syncServerStatus,
    };

    return (
        <_ServerStatusContext.Provider value={value}>
            {children}
        </_ServerStatusContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useServerStatus = (): ServerStatusContextValue => {
    const context = useContext(_ServerStatusContext);
    if (!context) {
        throw new Error("useResources must be used within a DVDInfoProvider");
    }
    return context;
};
