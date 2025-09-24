import { LiveTv, Palette } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Stack,
    Typography,
} from "@mui/material";
import ClickableCopyUrlField from "@renderer/components/ClickableCopyUrlField";
import { Logo } from "@renderer/components/Logo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home")({
    component: HomeComponent,
});

function HomeComponent(): React.JSX.Element {
    const [port, setPort] = useState<number | null>(null);
    const navigate = useNavigate({ from: "/home" });

    const handleClickCustomize = (): void => {
        navigate({ to: "/customize" });
    };

    const handleClickSettings = (): void => {
        navigate({ to: "/settings" });
    };

    useEffect(() => {
        window.api.getHttpServerStatus().then((status) => {
            if (status.running) {
                setPort(status.port);
            } else {
                setPort(null);
            }
        });
    }, []);

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
                        sx={{ flexGrow: 1 }}
                    >
                        neXus
                    </Typography>
                </Box>
            </Box>
            <Stack direction="column" spacing={2} sx={{ p: 2 }}>
                <Card>
                    <CardHeader
                        title={
                            <Stack alignItems="center" direction="row">
                                <Palette sx={{ mr: 1 }} />
                                カスタマイズ
                            </Stack>
                        }
                        action={
                            <Button onClick={handleClickCustomize}>
                                カスタマイズへ移動
                            </Button>
                        }
                    />
                    <CardContent>
                        <Typography variant="body1">
                            チーム名・ブランドロゴなどを変更できます
                        </Typography>
                    </CardContent>
                </Card>
                <Card>
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
                    <CardContent>
                        {port ? (
                            <>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    OBSなどの配信ソフトをお使いの場合は、このURLをブラウザソースに設定してください。
                                </Typography>
                                <ClickableCopyUrlField
                                    port={port}
                                    serverRunning={true}
                                    loading={false}
                                />
                            </>
                        ) : (
                            <Typography variant="body1" color="error">
                                HTTPサーバーが起動していません。設定画面で
                                ポート番号を指定して、サーバーを起動してください。
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}
