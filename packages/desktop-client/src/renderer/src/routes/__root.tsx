import { CssBaseline } from "@mui/material";
import { Layout } from "@renderer/components/Layout";
import { GameStatsContext } from "@renderer/hooks/useGameStats";
import { ServerStatusContext } from "@renderer/hooks/useServerStatus";
import { AppearanceProvider } from "@renderer/hooks/useAppearance";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const RootLayout = () => (
    <>
        <AppearanceProvider>
            <GameStatsContext>
                <ServerStatusContext>
                    <CssBaseline />
                    <Layout>
                        <Outlet />
                    </Layout>
                </ServerStatusContext>
            </GameStatsContext>
            <TanStackRouterDevtools position="bottom-right" />
        </AppearanceProvider>
    </>
);

export const Route = createRootRoute({ component: RootLayout });
