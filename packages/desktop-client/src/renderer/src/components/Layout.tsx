import {
    Home,
    Menu,
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
    Drawer as MuiDrawer,
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
    styled,
    Theme,
    CSSObject,
    IconButton,
    useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useServerStatus } from "@renderer/hooks/useServerStatus";
import { useGameStats } from "@renderer/hooks/useGameStats";
import { useCallback, useEffect, useState } from "react";
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

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

interface SideBarListItemProps {
    item: MenuItem;
    index: number;
    sideBarOpen: boolean;
    isCurrent: boolean;
    handleMenuClick: (link: string) => void;
}

const SideBarListItem: React.FC<SideBarListItemProps> = ({
    item,
    index,
    sideBarOpen,
    isCurrent,
    handleMenuClick,
}) => {
    return (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
                sx={[
                    {
                        minHeight: 48,
                        px: 2.5,
                    },
                    sideBarOpen
                        ? {
                              justifyContent: "initial",
                          }
                        : {
                              justifyContent: "center",
                          },
                ]}
                onClick={() => handleMenuClick(item.link)}
                selected={isCurrent}
            >
                <ListItemIcon
                    sx={[
                        {
                            minWidth: 0,
                            justifyContent: "center",
                        },
                        sideBarOpen
                            ? {
                                  mr: 3,
                              }
                            : {
                                  mr: "auto",
                              },
                    ]}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    sx={[
                        sideBarOpen
                            ? {
                                  opacity: 1,
                              }
                            : {
                                  opacity: 0,
                              },
                    ]}
                    primary={item.title}
                />
            </ListItemButton>
        </ListItem>
    );
};

export interface LayoutProps extends BoxProps {}

export function Layout({ children, ...rest }: LayoutProps): React.JSX.Element {
    const theme = useTheme();
    const location = useLocation();
    const { serverStatus } = useServerStatus();
    const { gameStats } = useGameStats();

    const [sideBarOpen, setSidebarOpen] = useState(true);
    const [userSideBarOpen, setUserSideBarOpen] = useState(true);
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

    const handleClickSidebarToggle = (): void => {
        setUserSideBarOpen(!userSideBarOpen);
        setSidebarOpen(!userSideBarOpen);
    };

    // ウィンドウサイズが小さい場合はサイドバーを閉じる
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < theme.breakpoints.values.sm) {
                setSidebarOpen(false);
            } else if (userSideBarOpen === true) {
                setSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [userSideBarOpen]);

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
                    <IconButton
                        className="webkit-app-region-no-drag"
                        onClick={() => handleClickSidebarToggle()}
                        edge="start"
                        sx={{
                            mr: 2,
                            display: { xs: "none", sm: "inline-flex" },
                        }}
                    >
                        <Menu />
                    </IconButton>
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
            <Drawer variant="permanent" open={sideBarOpen}>
                <Toolbar variant="dense" />
                <Box
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <List>
                        {MenuList.map((item, index) => (
                            <SideBarListItem
                                key={index}
                                item={item}
                                index={index}
                                sideBarOpen={sideBarOpen}
                                isCurrent={location.pathname === item.link}
                                handleMenuClick={handleMenuClick}
                            />
                        ))}
                    </List>
                    <Box sx={{ flexGrow: 1 }} />
                    <List>
                        {BottomMenuList.map((item, index) => (
                            <SideBarListItem
                                key={index}
                                item={item}
                                index={index}
                                sideBarOpen={sideBarOpen}
                                isCurrent={location.pathname === item.link}
                                handleMenuClick={handleMenuClick}
                            />
                        ))}
                    </List>
                </Box>
                <Divider />
                <Grid container>
                    <Grid
                        size={6}
                        borderRight={1}
                        borderColor={"divider"}
                        sx={{ overflowX: "hidden" }}
                    >
                        <Tooltip
                            title={
                                gameStats
                                    ? "ゲームは進行中です"
                                    : "ゲームクライアントが起動していません"
                            }
                        >
                            <ButtonBase
                                sx={{
                                    px: sideBarOpen
                                        ? 1
                                        : {
                                              xs: 0.25,
                                              sm: 0.5,
                                          },
                                    py: 0.5,
                                    width: "100%",
                                    display: "flex",
                                    alignContent: "center",
                                    justifyContent: sideBarOpen
                                        ? "center"
                                        : "inherit",
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
                                {}
                                <Typography
                                    sx={{
                                        ml: 1,
                                        opacity: sideBarOpen ? 1 : 0,
                                    }}
                                    fontSize={12}
                                >
                                    {gameStats ? "Live" : "Offline"}
                                </Typography>
                            </ButtonBase>
                        </Tooltip>
                    </Grid>
                    <Grid size={6} sx={{ overflowX: "hidden" }}>
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
                                    px: sideBarOpen
                                        ? 1
                                        : {
                                              xs: 0.25,
                                              sm: 0.5,
                                          },
                                    py: 0.5,
                                    width: "100%",
                                    display: "flex",
                                    alignContent: "center",
                                    justifyContent: sideBarOpen
                                        ? "center"
                                        : "inherit",
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
                                <Typography
                                    sx={{
                                        ml: 1,
                                        opacity: sideBarOpen ? 1 : 0,
                                    }}
                                    fontSize={12}
                                >
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
