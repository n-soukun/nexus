import { Save } from "@mui/icons-material";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TextFieldElement, useForm } from "react-hook-form-mui";
import { HUDCustomize } from "src/types";

export const Route = createFileRoute("/customize")({
    component: Customize,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Customize() {
    const [saving, setSaving] = useState(false);
    const { control, handleSubmit, watch, setValue } = useForm<HUDCustomize>({
        defaultValues: async () => {
            return await window.api.getHUDCustomize();
        },
    });

    const blueLogo = watch("blueLogo");
    const redLogo = watch("redLogo");

    const onSubmit = (data: HUDCustomize): void => {
        if (saving) return;
        setSaving(true);
        setTimeout(() => {
            window.api.setHUDCustomize(data).then(() => {
                setSaving(false);
            });
        }, 500);
    };

    const handleSelectIcon = (name: "blueLogo" | "redLogo"): void => {
        window.api.openImageFileDialog().then((filePath) => {
            if (filePath) {
                setValue(name, filePath);
            }
        });
    };

    return (
        <Box>
            <Box sx={{ p: 3, pb: 1 }}>
                <iframe
                    src="http://localhost:3000"
                    style={{
                        width: "100%",
                        height: 121,
                        border: "none",
                    }}
                />
                <Typography
                    variant="caption"
                    display="block"
                    color="#888"
                    sx={{ textAlign: "center", pt: 2 }}
                >
                    ※ 変更は保存ボタンを押すと反映されます
                </Typography>
            </Box>
            <Divider />
            <Container sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            ブルーチーム
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={5}>
                                <TextFieldElement
                                    id="blue-name"
                                    name="blueName"
                                    label="名前"
                                    control={control}
                                    required
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid size={5}>
                                <TextFieldElement
                                    id="blue-subtitle"
                                    name="blueSubtitle"
                                    label="サブタイトル"
                                    control={control}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <TextFieldElement
                                    id="blue-wins"
                                    name="blueWins"
                                    label="勝利数"
                                    type="number"
                                    control={control}
                                    required
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{ display: "inline-block", mr: 1 }}
                            >
                                アイコン
                            </Typography>
                            <TextFieldElement
                                id="blue-icon"
                                name="blueLogo"
                                type="hidden"
                                control={control}
                                required
                                sx={{ display: "none" }}
                            />
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                {blueLogo ? (
                                    <img
                                        src={blueLogo}
                                        alt="Blue Team Icon"
                                        style={{
                                            maxWidth: 60,
                                            maxHeight: 60,
                                            marginBottom: 8,
                                        }}
                                    />
                                ) : null}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    onClick={() => handleSelectIcon("blueLogo")}
                                >
                                    Upload File
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            レッドチーム
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={5}>
                                <TextFieldElement
                                    id="red-name"
                                    name="redName"
                                    label="名前"
                                    control={control}
                                    required
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid size={5}>
                                <TextFieldElement
                                    id="red-subtitle"
                                    name="redSubtitle"
                                    label="サブタイトル"
                                    control={control}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid size={2}>
                                <TextFieldElement
                                    id="red-wins"
                                    name="redWins"
                                    label="勝利数"
                                    type="number"
                                    control={control}
                                    required
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{ display: "inline-block", mr: 1 }}
                            >
                                アイコン
                            </Typography>
                            <TextFieldElement
                                id="red-icon"
                                name="redLogo"
                                type="hidden"
                                control={control}
                                required
                                sx={{ display: "none" }}
                            />
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                {redLogo ? (
                                    <img
                                        src={redLogo}
                                        alt="Red Team Icon"
                                        style={{
                                            maxWidth: 60,
                                            maxHeight: 60,
                                            marginBottom: 8,
                                        }}
                                    />
                                ) : null}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    onClick={() => handleSelectIcon("redLogo")}
                                >
                                    Upload File
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 4 }}
                            startIcon={<Save />}
                            loading={saving}
                        >
                            保存
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
}
