import { LiveTv, Palette, Tune } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import ClickableCopyUrlField from "@renderer/components/ClickableCopyUrlField";
import { Logo } from "@renderer/components/Logo";
import { useServerStatus } from "@renderer/hooks/useServerStatus";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import themesScreenshot from "../assets/themes-screenshot.png";
import customizeScreenshot from "../assets/customize-screenshot.png";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/home")({
    component: HomeComponent,
});

function HomeComponent(): React.JSX.Element {
    const { t } = useTranslation();
    const { serverStatus } = useServerStatus();
    const navigate = useNavigate({ from: "/home" });

    const handleClickThemes = (): void => {
        navigate({ to: "/theme" });
    };

    const handleClickCustomize = (): void => {
        navigate({ to: "/customize" });
    };

    const handleClickSettings = (): void => {
        navigate({ to: "/settings" });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    py: 1,
                    backgroundImage: "linear-gradient(45deg, #8561c5, #673ab7)",
                    height: 200,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 2, lineHeight: 0 }}>
                        <Logo width={52} height={52} />
                    </Box>
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            userSelect: "none",
                        }}
                    >
                        neXus
                    </Typography>
                </Box>
            </Box>
            <Stack direction="column" spacing={2} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    {t("screenTitle.home")}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader
                                title={
                                    <Stack alignItems="center" direction="row">
                                        <Palette sx={{ mr: 1 }} />
                                        {t("home.selectTheme")}
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickThemes}>
                                        {t("home.goToThemes")}
                                    </Button>
                                }
                            />
                            <CardMedia
                                component="img"
                                sx={{
                                    aspectRatio: "16 / 9",
                                    objectFit: "cover",
                                }}
                                image={themesScreenshot}
                                alt="Themes Screenshot"
                            />
                            <CardContent>
                                <Typography variant="body1">
                                    {t("home.selectThemeDescription")}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader
                                title={
                                    <Stack alignItems="center" direction="row">
                                        <Tune sx={{ mr: 1 }} />
                                        {t("screenTitle.customize")}
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickCustomize}>
                                        {t("home.goToCustomize")}
                                    </Button>
                                }
                            />
                            <CardMedia
                                component="img"
                                sx={{
                                    aspectRatio: "16 / 9",
                                    objectFit: "cover",
                                }}
                                image={customizeScreenshot}
                                alt="Customize Screenshot"
                            />
                            <CardContent>
                                <Typography variant="body1">
                                    {t("home.customizeDescription")}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <CardHeader
                                title={
                                    <Stack alignItems="center" direction="row">
                                        <LiveTv sx={{ mr: 1 }} />
                                        {t("home.overlaySettings")}
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickSettings}>
                                        {t("home.goToSettings")}
                                    </Button>
                                }
                            />
                            <Divider />
                            <CardContent sx={{ display: "flex", flexGrow: 1 }}>
                                <Box sx={{ m: "auto" }}>
                                    {serverStatus?.port ? (
                                        <>
                                            <Typography
                                                variant="body1"
                                                sx={{ mb: 1 }}
                                            >
                                                {t(
                                                    "home.browserSourceInstruction",
                                                )}
                                            </Typography>
                                            <ClickableCopyUrlField
                                                port={serverStatus.port}
                                                serverRunning={true}
                                                loading={false}
                                            />
                                        </>
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            color="error"
                                        >
                                            {t(
                                                "home.serverNotRunningInstruction1",
                                            )}
                                            {t(
                                                "home.serverNotRunningInstruction2",
                                            )}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
