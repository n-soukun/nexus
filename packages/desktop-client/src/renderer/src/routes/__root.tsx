import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Layout } from "@renderer/components/Layout";
import { GameStatsContext } from "@renderer/hooks/useGameStats";
import { ServerStatusContext } from "@renderer/hooks/useServerStatus";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            light: "#8561c5",
            main: "#673ab7",
            dark: "#482880",
            contrastText: "#fff",
        },
        secondary: {
            light: "#637bfe",
            main: "#3d5afe",
            dark: "#2a3eb1",
            contrastText: "#fff",
        },
    },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const RootLayout = () => (
    <>
        <ThemeProvider theme={theme}>
            <GameStatsContext>
                <ServerStatusContext>
                    <CssBaseline />
                    <Layout>
                        <Outlet />
                    </Layout>
                </ServerStatusContext>
            </GameStatsContext>
            <TanStackRouterDevtools position="bottom-right" />
        </ThemeProvider>
    </>
);

export const Route = createRootRoute({ component: RootLayout });
