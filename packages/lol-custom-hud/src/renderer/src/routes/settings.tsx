import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Backdrop,
    CircularProgress,
    TextField,
    Typography,
    ButtonGroup,
    CardHeader,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { sleep } from "@renderer/utils";
import { Refresh } from "@mui/icons-material";
import { ClickableCopyUrlField } from "../components/ClickableCopyUrlField";
import { useServerStatus } from "@renderer/hooks/useServerStatus";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings(): React.JSX.Element {
    const { serverStatus, syncServerStatus } = useServerStatus();
    const [portInput, setPortInput] = useState<string>("3000");
    const [loading, setLoading] = useState<boolean>(false);
    // URLコピーはコンポーネント側に集約

    const handlePortChange = async (): Promise<void> => {
        setLoading(true);
        const port = Number(portInput);
        if (Number.isNaN(port) || port < 1 || port > 65535) {
            return;
        }
        await window.api.restartHttpServer(port);
        await syncServerStatus();
        await sleep(1000); //連打防止
        setLoading(false);
    };

    const handleReloadClick = async (): Promise<void> => {
        setLoading(true);
        await syncServerStatus();
        await sleep(1000); //連打防止
        setLoading(false);
    };

    useEffect(() => {
        if (serverStatus?.port) {
            setPortInput(serverStatus.port.toString());
        }
    }, [serverStatus?.port]);
    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                設定
            </Typography>
            <Card>
                <CardHeader
                    slotProps={{ root: { sx: { py: 1 } } }}
                    title={
                        <Typography variant="h6" component="div">
                            オーバーレイ
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        ブラウザソースに設定するURL
                    </Typography>
                    <ClickableCopyUrlField
                        port={serverStatus?.port ?? 3000}
                        serverRunning={!!serverStatus?.running}
                        loading={loading}
                    />
                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardHeader
                    slotProps={{ root: { sx: { py: 1 } } }}
                    title={
                        <Typography variant="h6" component="div">
                            HTTPサーバー
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        サーバーの状態
                    </Typography>
                    <Chip
                        label={
                            loading
                                ? "読み込み中..."
                                : serverStatus
                                  ? `起動中 (ポート: ${serverStatus.port})`
                                  : "停止中"
                        }
                        color={serverStatus ? "success" : "error"}
                    />
                    <Button
                        variant="text"
                        onClick={handleReloadClick}
                        disabled={loading}
                        sx={{ ml: 2 }}
                        startIcon={<Refresh />}
                    >
                        更新
                    </Button>
                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2">
                            起動ポートの変更
                        </Typography>
                        <Typography variant="caption">
                            他のアプリケーションとポートが競合する場合などに変更してください
                        </Typography>
                    </Box>
                    <ButtonGroup
                        variant="contained"
                        aria-label="Basic button group"
                    >
                        <TextField
                            type="number"
                            value={portInput}
                            onChange={(e) => setPortInput(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                inputProps: { min: 1, max: 65535 },
                                sx: {
                                    borderEndEndRadius: 0,
                                    borderStartEndRadius: 0,
                                },
                            }}
                            disabled={loading}
                            sx={{ width: 200 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handlePortChange}
                            disabled={loading}
                            startIcon={<Refresh />}
                        >
                            サーバーを再起動
                        </Button>
                    </ButtonGroup>
                </CardContent>
            </Card>

            {/* Loading overlay */}
            <Backdrop
                open={loading}
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.modal + 1,
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
