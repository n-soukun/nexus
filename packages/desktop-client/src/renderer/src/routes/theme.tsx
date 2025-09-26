import { Delete, MoreVert } from "@mui/icons-material";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Stack,
    Skeleton,
    Link as MUILink,
    Snackbar,
    CardHeader,
    CardMedia,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddThemeResult, ThemeManifestV1 } from "src/types";

export const Route = createFileRoute("/theme")({
    component: ThemeComponent,
});

interface ThemeCardProps {
    theme: ThemeManifestV1;
    isCurrent: boolean;
    applyingThemeId: string;
    handleSetTheme: (themeId: string) => void;
    handleDelete: (themeId: string) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
    theme,
    isCurrent,
    applyingThemeId,
    handleSetTheme,
    handleDelete,
}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorEl);
    const handleMenuClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = (): void => {
        setAnchorEl(null);
    };

    const handleClickDelete = (): void => {
        handleMenuClose();
        handleDelete(theme.themeId);
    };

    const renderInfoRow = (
        label: string,
        value?: React.ReactNode,
        fallback: string = "-",
    ): React.ReactNode => (
        <Stack direction="row" spacing={1} sx={{ fontSize: 12 }}>
            <Box sx={{ color: "text.secondary", minWidth: 70 }}>{label}</Box>
            <Box sx={{ fontWeight: 500, wordBreak: "break-word", flex: 1 }}>
                {value || fallback}
            </Box>
        </Stack>
    );

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderColor: isCurrent ? "primary.main" : undefined,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <CardHeader
                title={<Typography variant="h6">{theme.name}</Typography>}
                subheader={
                    <Typography variant="body2" color="textSecondary">
                        {theme.version}
                    </Typography>
                }
                action={
                    <>
                        <Tooltip title={t("tooltip.otherActions")}>
                            <IconButton onClick={handleMenuClick}>
                                <MoreVert />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="theme-card-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            slotProps={{
                                list: {
                                    "aria-labelledby": "basic-button",
                                },
                            }}
                        >
                            <MenuItem
                                onClick={handleClickDelete}
                                disabled={isCurrent}
                            >
                                <ListItemIcon>
                                    <Delete fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>
                                    {t("button.delete")}
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </>
                }
            />
            {theme.thumbnail && (
                <CardMedia
                    sx={{
                        aspectRatio: "16/9",
                        objectFit: "cover",
                        width: "100%",
                        height: "auto",
                    }}
                    component="img"
                    image={theme.thumbnail}
                    alt="Paella dish"
                />
            )}

            <CardContent sx={{ pb: 1, flex: 1 }}>
                <Stack spacing={1}>
                    {theme.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                lineHeight: 1.4,
                            }}
                        >
                            {theme.description}
                        </Typography>
                    )}
                    <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                        {renderInfoRow(
                            t("text.author"),
                            theme.author ? (
                                theme.authorUrl ? (
                                    <MUILink
                                        href={theme.authorUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        underline="hover"
                                    >
                                        {theme.author}
                                    </MUILink>
                                ) : (
                                    theme.author
                                )
                            ) : undefined,
                        )}
                        {renderInfoRow(
                            t("text.website"),
                            theme.website ? (
                                <MUILink
                                    href={theme.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    underline="hover"
                                >
                                    {theme.website.replace(/^https?:\/\//, "")}
                                </MUILink>
                            ) : undefined,
                        )}
                        {renderInfoRow(
                            t("text.license"),
                            theme.license ? (
                                theme.licenseUrl ? (
                                    <MUILink
                                        href={theme.licenseUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        underline="hover"
                                    >
                                        {theme.license}
                                    </MUILink>
                                ) : (
                                    theme.license
                                )
                            ) : undefined,
                        )}
                    </Stack>
                </Stack>
            </CardContent>
            <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <Button
                    variant={isCurrent ? "outlined" : "contained"}
                    fullWidth
                    disabled={isCurrent}
                    loading={applyingThemeId === theme.themeId}
                    onClick={() => handleSetTheme(theme.themeId)}
                >
                    {isCurrent ? t("button.applied") : t("button.apply")}
                </Button>
            </CardActions>
        </Card>
    );
};

function ThemeComponent(): React.JSX.Element {
    const { t } = useTranslation();
    const [themes, setThemes] = useState<ThemeManifestV1[]>([]);
    const [addThemeLoading, setAddThemeLoading] = useState<boolean>(false);
    const [currentThemeId, setCurrentThemeId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [applyingThemeId, setApplyingThemeId] = useState<string>("");
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // Confirmation dialogs state
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
        open: boolean;
        themeId: string;
        themeName: string;
    }>({ open: false, themeId: "", themeName: "" });

    const [versionUpConfirmDialog, setVersionUpConfirmDialog] = useState<{
        open: boolean;
    }>({ open: false });

    const loadThemes = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedThemes, current] = await Promise.all([
                window.api.getThemes(),
                window.api.getCurrentThemeId(),
            ]);
            setThemes(fetchedThemes || []);
            if (current) setCurrentThemeId(current);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [fetchedThemes, current] = await Promise.all([
                    window.api.getThemes(),
                    window.api.getCurrentThemeId(),
                ]);
                if (!mounted) return;
                setThemes(fetchedThemes || []);
                if (current) setCurrentThemeId(current);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const handleSetTheme = useCallback(
        async (themeId: string): Promise<void> => {
            try {
                setApplyingThemeId(themeId);
                const success = await window.api.setTheme(themeId);
                if (success) {
                    setCurrentThemeId(themeId);
                }
                setSnackbar({
                    open: true,
                    message: success
                        ? t("toast.themeApplied")
                        : t("toast.failedToApplyTheme"),
                    severity: success ? "success" : "error",
                });
            } finally {
                setApplyingThemeId("");
            }
        },
        [],
    );

    const sortedThemes = useMemo(
        () => [...themes].sort((a, b) => a.name.localeCompare(b.name, "ja")),
        [themes],
    );

    const handleDelete = async (themeId: string): Promise<void> => {
        if (themeId === currentThemeId) {
            setSnackbar({
                open: true,
                message: t("toast.cannotDeleteCurrentTheme"),
                severity: "error",
            });
            return;
        }

        // Find theme name for the confirmation dialog
        const theme = themes.find((t) => t.themeId === themeId);
        const themeName = theme?.name || "";

        setDeleteConfirmDialog({
            open: true,
            themeId,
            themeName,
        });
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        const { themeId } = deleteConfirmDialog;
        setDeleteConfirmDialog({ open: false, themeId: "", themeName: "" });

        const success = await window.api.deleteThemeById(themeId);
        if (success) {
            await loadThemes();
            setSnackbar({
                open: true,
                message: t("toast.themeDeleted"),
                severity: "success",
            });
        } else {
            setSnackbar({
                open: true,
                message: t("toast.failedToDeleteTheme"),
                severity: "error",
            });
        }
    };

    const handleDeleteCancel = (): void => {
        setDeleteConfirmDialog({ open: false, themeId: "", themeName: "" });
    };

    const handleAddTheme = async (): Promise<void> => {
        setAddThemeLoading(true);
        const result: AddThemeResult = await window.api.openNewThemeDialog();
        if (result.result && result.isVersionUp) {
            setVersionUpConfirmDialog({ open: true });
        } else if (result.result) {
            setSnackbar({
                open: true,
                message: t("toast.themeAdded"),
                severity: "success",
            });
            await loadThemes();
        } else {
            setSnackbar({
                open: true,
                message: result.error || t("toast.failedToAddTheme"),
                severity: "error",
            });
        }
        setAddThemeLoading(false);
    };

    const handleVersionUpConfirm = async (): Promise<void> => {
        setVersionUpConfirmDialog({ open: false });
        const res = await window.api.continueVersionUp();
        if (res.result) {
            setSnackbar({
                open: true,
                message: t("toast.themeUpgraded"),
                severity: "success",
            });
            await loadThemes();
        } else {
            setSnackbar({
                open: true,
                message: res.error || t("toast.failedToUpgradeTheme"),
                severity: "error",
            });
        }
    };

    const handleVersionUpCancel = async (): Promise<void> => {
        setVersionUpConfirmDialog({ open: false });
        await window.api.cancelVersionUp();
    };

    return (
        <Box sx={{ p: 3, position: "relative" }}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignContent={"center"}
            >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    {t("screenTitle.themes")}
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleAddTheme}
                        loading={addThemeLoading}
                    >
                        {t("button.addTheme")}
                    </Button>
                </Box>
            </Stack>
            {loading && (
                <Grid container spacing={2}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={i}>
                            <Skeleton variant="rounded" height={230} />
                        </Grid>
                    ))}
                </Grid>
            )}
            {!loading && sortedThemes.length === 0 && (
                <Box sx={{ color: "text.secondary" }}>
                    {t("text.noThemesAvailable")}
                </Box>
            )}
            {!loading && sortedThemes.length > 0 && (
                <Grid container spacing={2}>
                    {sortedThemes.map((t) => {
                        const isCurrent = t.themeId === currentThemeId;
                        return (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 5, lg: 4, xl: 3 }}
                                key={t.themeId}
                            >
                                <ThemeCard
                                    theme={t}
                                    isCurrent={isCurrent}
                                    applyingThemeId={applyingThemeId}
                                    handleSetTheme={handleSetTheme}
                                    handleDelete={handleDelete}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                message={snackbar.message}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {t("dialog.deleteTheme.title")}
                </DialogTitle>
                <DialogContent
                    sx={{
                        maxWidth: 400,
                        width: "90vw",
                    }}
                >
                    <DialogContentText id="delete-dialog-description">
                        {t("dialog.deleteTheme.description1", {
                            name: deleteConfirmDialog.themeName,
                        })}
                        <br />
                        {t("dialog.deleteTheme.description2")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color={"inherit"}>
                        {t("button.cancel")}
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        autoFocus
                    >
                        {t("button.delete")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Version Up Confirmation Dialog */}
            <Dialog
                open={versionUpConfirmDialog.open}
                onClose={handleVersionUpCancel}
                aria-labelledby="version-up-dialog-title"
                aria-describedby="version-up-dialog-description"
            >
                <DialogTitle id="version-up-dialog-title">
                    {t("dialog.upgradeTheme.title")}
                </DialogTitle>
                <DialogContent
                    sx={{
                        maxWidth: 400,
                        width: "90vw",
                    }}
                >
                    <DialogContentText id="version-up-dialog-description">
                        {t("dialog.upgradeTheme.description1")}
                        <br />
                        {t("dialog.upgradeTheme.description2")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleVersionUpCancel} color={"inherit"}>
                        {t("button.cancel")}
                    </Button>
                    <Button
                        onClick={handleVersionUpConfirm}
                        autoFocus
                        color="success"
                    >
                        {t("button.execute")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
