import { CssBaseline } from "@mui/material";
import { Layout } from "@renderer/components/Layout";
import { GameStatsContext } from "@renderer/hooks/useGameStats";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const RootLayout = () => (
    <>
        <GameStatsContext>
            <CssBaseline />
            <Layout>
                <Outlet />
            </Layout>
        </GameStatsContext>
        <TanStackRouterDevtools />
    </>
);

export const Route = createRootRoute({ component: RootLayout });
