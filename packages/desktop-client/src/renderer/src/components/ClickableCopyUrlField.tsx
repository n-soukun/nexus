import { useState, useCallback } from "react";
import {
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Snackbar,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { textToClipboard } from "@renderer/utils";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
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

    const copyTextToClipboard = useCallback(textToClipboard, []);

    const handleCopy = useCallback(async () => {
        if (!serverRunning) {
            showMessage(t("toast.serverNotRunning"));
            return;
        }
        const url = `http://localhost:${port}`;
        const ok = await copyTextToClipboard(url);
        showMessage(ok ? t("toast.urlCopied") : t("toast.failedToCopyUrl"));
    }, [serverRunning, port, copyTextToClipboard, showMessage]);

    return (
        <>
            <TextField
                fullWidth
                value={
                    serverRunning
                        ? `http://localhost:${port}`
                        : t("toast.serverNotRunning")
                }
                variant="outlined"
                size="small"
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title={t("tooltip.copy")}>
                                <span>
                                    <IconButton
                                        size="small"
                                        aria-label="copy url"
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
                    title: t("text.clickToCopy"),
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
