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
    Stack,
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent,
    Radio,
    RadioGroup,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { sleep } from "@renderer/utils";
import { Refresh } from "@mui/icons-material";
import { ClickableCopyUrlField } from "../components/ClickableCopyUrlField";
import { useServerStatus } from "@renderer/hooks/useServerStatus";
import { useAppearance } from "@renderer/hooks/useAppearance";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
    component: Settings,
});

function Settings(): React.JSX.Element {
    const { t } = useTranslation();
    const { serverStatus, syncServerStatus } = useServerStatus();
    const { appearanceConfig, updateAppearanceConfig } = useAppearance();
    const [portInput, setPortInput] = useState<string>("3000");
    const [loading, setLoading] = useState<boolean>(false);
    const [restartDialog, setRestartDialog] = useState<boolean>(false);
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

    const handleColorModeChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
        const newColorMode = event.target.value as "light" | "dark";
        if (newColorMode !== appearanceConfig.colorMode) {
            await updateAppearanceConfig({ colorMode: newColorMode });
            setRestartDialog(true);
        }
    };

    const handleLanguageChange = async (
        event: SelectChangeEvent,
    ): Promise<void> => {
        const newLanguage = event.target.value as "en" | "ja";
        if (newLanguage !== appearanceConfig.language) {
            await updateAppearanceConfig({ language: newLanguage });
        }
    };

    const handleRestartApp = (): void => {
        window.electron.ipcRenderer.send("restart-app");
    };

    const handleCloseRestartDialog = (): void => {
        setRestartDialog(false);
    };

    useEffect(() => {
        if (serverStatus?.port) {
            setPortInput(serverStatus.port.toString());
        }
    }, [serverStatus?.port]);
    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t("screenTitle.settings")}
            </Typography>
            <Card>
                <CardHeader
                    slotProps={{ root: { sx: { py: 1 } } }}
                    title={
                        <Typography variant="h6" component="div">
                            {t("cardTitle.overlaySettings")}
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {t("text.browserSourceUrlDescription")}
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
                            {t("cardTitle.displaySettings")}
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Stack spacing={3}>
                        {/* Color Theme */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {t("text.colorTheme")}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ mb: 2, display: "block" }}
                            >
                                {t("text.colorThemeDescription")}
                            </Typography>
                            <FormControl>
                                <RadioGroup
                                    value={appearanceConfig.colorMode}
                                    onChange={handleColorModeChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="light"
                                        control={<Radio />}
                                        label={t("chipLabel.light")}
                                    />
                                    <FormControlLabel
                                        value="dark"
                                        control={<Radio />}
                                        label={t("chipLabel.dark")}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* Language */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {t("text.language")}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ mb: 2, display: "block" }}
                            >
                                {t("text.languageDescription")}
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                    value={appearanceConfig.language}
                                    onChange={handleLanguageChange}
                                >
                                    <MenuItem value="en">
                                        {t("chipLabel.english")}
                                    </MenuItem>
                                    <MenuItem value="ja">
                                        {t("chipLabel.japanese")}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardHeader
                    slotProps={{ root: { sx: { py: 1 } } }}
                    title={
                        <Typography variant="h6" component="div">
                            {t("cardTitle.httpServerSettings")}
                        </Typography>
                    }
                />
                <Divider />
                <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        {t("text.serverStatus")}
                    </Typography>
                    <Chip
                        label={
                            loading
                                ? t("chip.loading")
                                : serverStatus
                                  ? t("chip.runningAt", {
                                        port: serverStatus.port,
                                    })
                                  : t("chip.stopped")
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
                        {t("button.refresh")}
                    </Button>
                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2">
                            {t("text.changePort")}
                        </Typography>
                        <Typography variant="caption">
                            {t("text.changePortDescription")}
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
                            {t("button.restartServer")}
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

            {/* Restart Dialog */}
            <Dialog
                open={restartDialog}
                onClose={handleCloseRestartDialog}
                aria-labelledby="restart-dialog-title"
                aria-describedby="restart-dialog-description"
            >
                <DialogTitle id="restart-dialog-title">
                    {t("dialog.restartApp.title")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="restart-dialog-description">
                        {t("dialog.restartApp.description")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRestartDialog}>
                        {t("button.cancel")}
                    </Button>
                    <Button onClick={handleRestartApp} variant="contained">
                        {t("button.restart")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
