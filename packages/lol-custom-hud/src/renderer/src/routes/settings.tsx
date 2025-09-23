import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Backdrop,
    CircularProgress,
    Snackbar,
    IconButton,
    InputAdornment,
    Tooltip,
    TextField,
    Typography,
    ButtonGroup,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { sleep } from "@renderer/utils";
import { Refresh } from "@mui/icons-material";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings(): React.JSX.Element {
    const [port, setPort] = useState<number>(3000);
    const [portInput, setPortInput] = useState<string>("3000");
    const [serverStatus, setServerStatus] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");

    const copyTextToClipboard = async (text: string): Promise<boolean> => {
        // Try modern clipboard API first
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback using a hidden textarea
            try {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed"; // avoid scroll to bottom
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                const ok = document.execCommand("copy");
                document.body.removeChild(textarea);
                return ok;
            } catch {
                return false;
            }
        }
    };

    const handleCopyClick = async (): Promise<void> => {
        if (!serverStatus) {
            setSnackbarMessage("サーバーが起動していません");
            setSnackbarOpen(true);
            return;
        }
        const text = `http://localhost:${port}`;
        const ok = await copyTextToClipboard(text);
        setSnackbarMessage(ok ? "URLをコピーしました" : "コピーに失敗しました");
        setSnackbarOpen(true);
    };

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
            <Card variant="outlined">
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
                    <TextField
                        fullWidth
                        value={
                            serverStatus
                                ? `http://localhost:${port}`
                                : "サーバーが起動していません"
                        }
                        variant="outlined"
                        size="small"
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="コピー">
                                        <span>
                                            <IconButton
                                                size="small"
                                                aria-label="URLをコピー"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleCopyClick();
                                                }}
                                                disabled={
                                                    loading || !serverStatus
                                                }
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            title: "クリックでコピー",
                            style: { cursor: "pointer" },
                        }}
                        onClick={handleCopyClick}
                        sx={{ cursor: "pointer" }}
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
