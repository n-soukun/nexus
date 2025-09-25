import {
    Home,
    Palette,
    Settings,
    SportsEsports,
    Tune,
    VideogameAsset,
    VideogameAssetOff,
    WifiTethering,
    WifiTetheringError,
    WifiTetheringOff,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    BoxProps,
    ButtonBase,
    Divider,
    Drawer,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Snackbar,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useServerStatus } from "@renderer/hooks/useServerStatus";
import { useGameStats } from "@renderer/hooks/useGameStats";
import { useCallback, useState } from "react";
import { textToClipboard } from "@renderer/utils";

interface MenuItem {
    title: string;
    icon: React.JSX.Element;
    link: string;
}

const MenuList: MenuItem[] = [
    { title: "ホーム", icon: <Home />, link: "/home" },
    { title: "ゲーム情報", icon: <SportsEsports />, link: "/gamestats" },
    { title: "テーマ", icon: <Palette />, link: "/theme" },
    { title: "カスタマイズ", icon: <Tune />, link: "/customize" },
];

const BottomMenuList: MenuItem[] = [
    { title: "設定", icon: <Settings />, link: "/settings" },
];

const drawerWidth = 240;

export interface LayoutProps extends BoxProps {}

export function Layout({ children, ...rest }: LayoutProps): React.JSX.Element {
    const { serverStatus } = useServerStatus();
    const { gameStats } = useGameStats();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showMessage = useCallback((msg: string) => {
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    }, []);

    const copyTextToClipboard = useCallback(textToClipboard, []);

    const handleCopy = useCallback(async () => {
        if (!serverStatus?.running) {
            showMessage("サーバーが起動していません");
            return;
        }
        const url = `http://localhost:${serverStatus.port}`;
        const ok = await copyTextToClipboard(url);
        showMessage(ok ? "URLをコピーしました" : "コピーに失敗しました");
    }, [serverStatus, copyTextToClipboard, showMessage]);

    const navigate = useNavigate();
    const handleMenuClick = (link: string): void => {
        navigate({ to: link });
    };

    const handleClickGameStatus = (): void => {
        navigate({ to: "/gamestats" });
    };

    return (
        <Box sx={{ display: "flex", flexGrow: 1 }} width={"100%"}>
            <AppBar
                variant="outlined"
                color="default"
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                className="webkit-app-region-drag"
            >
                <Toolbar variant="dense">
                    <Box sx={{ mr: 1, lineHeight: 0 }}>
                        <Logo width={24} height={24} />
                    </Box>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        neXus
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar variant="dense" />
                <Box
                    sx={{
                        overflow: "auto",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <List>
                        {MenuList.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item.link)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ flexGrow: 1 }} />
                    <List>
                        {BottomMenuList.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item.link)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Divider />
                <Grid container>
                    <Grid size={6} borderRight={1} borderColor={"divider"}>
                        <Tooltip
                            title={
                                gameStats
                                    ? "ゲームは進行中です"
                                    : "ゲームクライアントが起動していません"
                            }
                        >
                            <ButtonBase
                                sx={{
                                    px: 1,
                                    py: 0.5,
                                    width: "100%",
                                    display: "flex",
                                    alignContent: "center",
                                    transition: (theme) =>
                                        theme.transitions.create(
                                            "background-color",
                                        ),
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                                onClick={() => handleClickGameStatus()}
                            >
                                {gameStats ? (
                                    <VideogameAsset />
                                ) : (
                                    <VideogameAssetOff />
                                )}
                                <Typography
                                    sx={{ ml: 1, userSelect: "none" }}
                                    fontSize={12}
                                >
                                    {gameStats ? "Live" : "Offline"}
                                </Typography>
                            </ButtonBase>
                        </Tooltip>
                    </Grid>
                    <Grid size={6}>
                        <Tooltip
                            title={
                                serverStatus
                                    ? serverStatus.running
                                        ? `サーバーは http://localhost:${serverStatus?.port} で起動しています`
                                        : "サーバーは停止中です"
                                    : "サーバーステータスの取得に失敗しました"
                            }
                        >
                            <ButtonBase
                                sx={{
                                    px: 1,
                                    py: 0.5,
                                    width: "100%",
                                    display: "flex",
                                    alignContent: "center",
                                    transition: (theme) =>
                                        theme.transitions.create(
                                            "background-color",
                                        ),
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                                onClick={() => void handleCopy()}
                            >
                                {serverStatus ? (
                                    serverStatus.running ? (
                                        <WifiTethering />
                                    ) : (
                                        <WifiTetheringOff />
                                    )
                                ) : (
                                    <WifiTetheringError />
                                )}
                                <Typography sx={{ ml: 1 }} fontSize={12}>
                                    {serverStatus
                                        ? serverStatus.running
                                            ? serverStatus.port
                                            : "Stopped"
                                        : "Error"}
                                </Typography>
                            </ButtonBase>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                }}
            >
                <Toolbar variant="dense" />
                <Box {...rest} overflow="auto" flexGrow={1}>
                    {children}
                </Box>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
}
