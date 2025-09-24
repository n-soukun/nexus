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
    syncServerStatus: () => void;
}

const _ServerStatusContext = createContext<ServerStatusContextValue>(null!);

// eslint-disable-next-line react/prop-types
export const ServerStatusContext: React.FC<PropsWithChildren> = ({
    // eslint-disable-next-line react/prop-types
    children,
}) => {
    const [_serverStatus, setServerStatus] = useState<HTTPServerStatus | null>(
        null,
    );

    useEffect(() => {
        window.api.getHttpServerStatus().then((status) => {
            setServerStatus(status);
        });
    }, []);

    const syncServerStatus = (): void => {
        window.api.getHttpServerStatus().then((status) => {
            setServerStatus(status);
        });
    };

    const serverStatus = {
        get serverStatus() {
            window.api.getHttpServerStatus().then((status) => {
                setServerStatus(status);
            });
            return _serverStatus;
        },
        syncServerStatus,
    };

    return (
        <_ServerStatusContext.Provider value={serverStatus}>
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
