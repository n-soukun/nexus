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

export const Route = createFileRoute("/home")({
    component: HomeComponent,
});

function HomeComponent(): React.JSX.Element {
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
                    neXusへようこそ
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader
                                title={
                                    <Stack alignItems="center" direction="row">
                                        <Palette sx={{ mr: 1 }} />
                                        テーマを選択
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickThemes}>
                                        テーマへ移動
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
                                    テーマを追加・変更することで、簡単にオーバーレイの見た目を変更できます。
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
                                        カスタマイズ
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickCustomize}>
                                        カスタマイズへ移動
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
                                    チームの名前やロゴを設定したり、ブランドロゴや試合ルールを設定できます。
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
                                        オーバーレイ設定
                                    </Stack>
                                }
                                action={
                                    <Button onClick={handleClickSettings}>
                                        設定へ移動
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
                                                OBSなどの配信ソフトをお使いの場合は、このURLをブラウザソースに設定してください。
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
                                            HTTPサーバーが起動していません。設定画面で
                                            ポート番号を指定して、サーバーを起動してください。
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
