import { Palette, Settings } from "@mui/icons-material";
import {
    AppBar,
    Box,
    BoxProps,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";

interface MenuItem {
    title: string;
    icon: React.JSX.Element;
    link: string;
}

const MenuList: MenuItem[] = [
    { title: "カスタマイズ", icon: <Palette />, link: "/customize" },
    { title: "設定", icon: <Settings />, link: "/settings" },
];

const drawerWidth = 240;

export interface LayoutProps extends BoxProps {}

export function Layout({ children, ...rest }: LayoutProps): React.JSX.Element {
    const navigate = useNavigate();
    const handleMenuClick = (link: string): void => {
        navigate({ to: link });
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
                        LoL Custom HUD
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
                <Box sx={{ overflow: "auto" }}>
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
                </Box>
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
        </Box>
    );
}
