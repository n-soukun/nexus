import { useState, useCallback } from "react";
import {
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ClickableCopyUrlFieldProps {
    port: number;
    serverRunning: boolean;
    loading?: boolean;
    /**
     * コピー成功/失敗や未起動メッセージを親で扱いたい場合に使用
     */
    onFeedback?: (message: string) => void;
}

/**
 * URL 表示 + クリック/ボタンでクリップボードへコピーするフィールド。
 * サーバー未起動時は状態メッセージを表示しコピー無効。
 */
export function ClickableCopyUrlField({
    port,
    serverRunning,
    loading = false,
    onFeedback,
}: ClickableCopyUrlFieldProps): React.JSX.Element {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showMessage = useCallback(
        (msg: string) => {
            setSnackbarMessage(msg);
            setSnackbarOpen(true);
            onFeedback?.(msg);
        },
        [onFeedback],
    );

    const copyTextToClipboard = useCallback(
        async (text: string): Promise<boolean> => {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                try {
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    textarea.style.position = "fixed";
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
        },
        [],
    );

    const handleCopy = useCallback(async () => {
        if (!serverRunning) {
            showMessage("サーバーが起動していません");
            return;
        }
        const url = `http://localhost:${port}`;
        const ok = await copyTextToClipboard(url);
        showMessage(ok ? "URLをコピーしました" : "コピーに失敗しました");
    }, [serverRunning, port, copyTextToClipboard, showMessage]);

    return (
        <>
            <TextField
                fullWidth
                value={
                    serverRunning
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
                                            void handleCopy();
                                        }}
                                        disabled={loading || !serverRunning}
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
                onClick={() => void handleCopy()}
                sx={{ cursor: "pointer" }}
            />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </>
    );
}

export default ClickableCopyUrlField;
