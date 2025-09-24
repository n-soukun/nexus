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
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { sleep } from "@renderer/utils";
import { Refresh } from "@mui/icons-material";
import { ClickableCopyUrlField } from "../components/ClickableCopyUrlField";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings(): React.JSX.Element {
    const [port, setPort] = useState<number>(3000);
    const [portInput, setPortInput] = useState<string>("3000");
    const [serverStatus, setServerStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    // URLコピーはコンポーネント側に集約

    const handlePortChange = async (): Promise<void> => {
        setLoading(true);
        const port = Number(portInput);
        if (Number.isNaN(port) || port < 1 || port > 65535) {
            return;
        }
        await window.api.restartHttpServer(port);
        const status = await window.api.getHttpServerStatus();
        setServerStatus(status.running);
        setPort(status.port);
        await sleep(1000); //連打防止
        setLoading(false);
    };

    const handleReloadClick = async (): Promise<void> => {
        setLoading(true);
        const result = await window.api.getHttpServerStatus();
        setServerStatus(result.running);
        setPort(result.port);
        await sleep(1000); //連打防止
        setLoading(false);
    };

    useEffect(() => {
        window.api.getHttpServerStatus().then((status) => {
            setServerStatus(status.running);
            setPort(status.port);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setPortInput(port.toString());
    }, [port]);
    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                設定
            </Typography>
            <Card>
                <CardContent sx={{ py: 1 }}>
                    <Typography variant="h6" component="div">
                        オーバーレイ
                    </Typography>
                </CardContent>
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        ブラウザソースに設定するURL
                    </Typography>
                    <ClickableCopyUrlField
                        port={port}
                        serverRunning={serverStatus}
                        loading={loading}
                    />

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        httpサーバー
                    </Typography>
                    <Chip
                        label={
                            loading
                                ? "読み込み中..."
                                : serverStatus
                                  ? `起動中 (ポート: ${port})`
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
