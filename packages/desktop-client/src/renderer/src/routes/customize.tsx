import { Close, Edit, Save, Upload } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    Grid,
    Rating,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import { LogoView } from "@renderer/components/LogoView";
import { useServerStatus } from "@renderer/hooks/useServerStatus";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
    Controller,
    SelectElement,
    TextFieldElement,
    useForm,
} from "react-hook-form-mui";
import { HUDCustomize } from "src/types";

export const Route = createFileRoute("/customize")({
    component: Customize,
});

interface LogoPickerProps {
    logo: string;
    onClickChange: () => void;
    onClickReset: () => void;
}

const LogoPicker: React.FC<LogoPickerProps> = ({
    logo,
    onClickChange,
    onClickReset,
}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            {logo ? (
                <>
                    <LogoView src={logo} />
                    <Tooltip title="画像をアップロードして変更">
                        <Button
                            variant="text"
                            component="label"
                            onClick={onClickChange}
                            startIcon={<Edit />}
                        >
                            変更
                        </Button>
                    </Tooltip>
                    <Tooltip title="テーマのデフォルトに戻す">
                        <Button
                            variant="text"
                            color="error"
                            component="label"
                            onClick={onClickReset}
                            startIcon={<Close />}
                        >
                            リセット
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Button
                    variant="outlined"
                    component="label"
                    onClick={onClickChange}
                    startIcon={<Upload />}
                >
                    画像を選択
                </Button>
            )}
        </Stack>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function Customize() {
    const { serverStatus } = useServerStatus();

    const [saving, setSaving] = useState(false);
    const { control, handleSubmit, watch, setValue, reset } =
        useForm<HUDCustomize>({
            defaultValues: async () => {
                return await window.api.getHUDCustomize();
            },
        });

    const blueLogo = watch("blueLogo");
    const redLogo = watch("redLogo");
    const tournamentLogo = watch("tournamentLogo");
    const tournamentRule = watch("tournamentRule");

    const handleReset = (): void => {
        window.api.getHUDCustomize().then((values) => {
            reset(values);
        });
    };

    const onSubmit = (data: HUDCustomize): void => {
        if (saving) return;
        setSaving(true);
        setTimeout(() => {
            window.api.setHUDCustomize(data).then(() => {
                setSaving(false);
            });
        }, 500);
    };

    const handleSelectIcon = (
        name: "blueLogo" | "redLogo" | "tournamentLogo",
    ): void => {
        window.api.openImageFileDialog().then((filePath) => {
            if (filePath) {
                setValue(name, filePath);
            }
        });
    };

    return (
        <Box>
            <Box>
                <iframe
                    src={`http://localhost:${serverStatus?.port ?? 3000}`}
                    style={{
                        width: "100%",
                        height: 136,
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

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ px: 3, pt: 3 }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        カスタマイズ
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            disabled={saving}
                            type="button"
                            onClick={handleReset}
                        >
                            リセット
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            loading={saving}
                        >
                            保存
                        </Button>
                    </Stack>
                </Stack>
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                slotProps={{ root: { sx: { py: 1 } } }}
                                title={
                                    <Typography variant="h6" component="div">
                                        ブルーチーム
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    成績
                                </Typography>
                                <Controller
                                    name="blueWins"
                                    control={control}
                                    render={({
                                        field: { onChange, value, ref, name },
                                    }) => (
                                        <Rating
                                            // reset 時に正しく再描画されるよう key を付与
                                            key={"blue-" + tournamentRule}
                                            name={name}
                                            ref={ref}
                                            value={value}
                                            onChange={(_, value) =>
                                                onChange(value ?? 0)
                                            }
                                            max={
                                                tournamentRule === "bo5" ? 3 : 2
                                            }
                                        />
                                    )}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    チーム情報
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextFieldElement
                                            variant="standard"
                                            id="blue-name"
                                            name="blueName"
                                            label="名前"
                                            control={control}
                                            required
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextFieldElement
                                            variant="standard"
                                            id="blue-subtitle"
                                            name="blueSubtitle"
                                            label="サブタイトル"
                                            control={control}
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextFieldElement
                                    id="blue-icon"
                                    name="blueLogo"
                                    type="hidden"
                                    control={control}
                                    sx={{ display: "none" }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    チームロゴ
                                </Typography>

                                <LogoPicker
                                    logo={blueLogo}
                                    onClickChange={() =>
                                        handleSelectIcon("blueLogo")
                                    }
                                    onClickReset={() =>
                                        setValue("blueLogo", "")
                                    }
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardHeader
                                slotProps={{ root: { sx: { py: 1 } } }}
                                title={
                                    <Typography variant="h6" component="div">
                                        レッドチーム
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    成績
                                </Typography>
                                <Controller
                                    name="redWins"
                                    control={control}
                                    render={({
                                        field: { onChange, value, ref, name },
                                    }) => (
                                        <Rating
                                            key={"red-" + tournamentRule}
                                            name={name}
                                            ref={ref}
                                            value={value}
                                            onChange={(_, value) =>
                                                onChange(value ?? 0)
                                            }
                                            max={
                                                tournamentRule === "bo5" ? 3 : 2
                                            }
                                        />
                                    )}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    チーム情報
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextFieldElement
                                            variant="standard"
                                            id="red-name"
                                            name="redName"
                                            label="名前"
                                            control={control}
                                            required
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextFieldElement
                                            variant="standard"
                                            id="red-subtitle"
                                            name="redSubtitle"
                                            label="サブタイトル"
                                            control={control}
                                            sx={{ width: "100%" }}
                                        />
                                    </Grid>
                                </Grid>
                                <TextFieldElement
                                    id="red-icon"
                                    name="redLogo"
                                    type="hidden"
                                    control={control}
                                    sx={{ display: "none" }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    チームロゴ
                                </Typography>
                                <LogoPicker
                                    logo={redLogo}
                                    onClickChange={() =>
                                        handleSelectIcon("redLogo")
                                    }
                                    onClickReset={() => setValue("redLogo", "")}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Card sx={{ mt: 2, width: "100%" }}>
                        <CardHeader
                            slotProps={{ root: { sx: { py: 1 } } }}
                            title={
                                <Typography variant="h6" component="div">
                                    全般
                                </Typography>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Typography
                                variant="subtitle2"
                                sx={{ mt: 2, mb: 1 }}
                            >
                                トーナメント
                            </Typography>
                            <FormControl fullWidth sx={{ maxWidth: 240 }}>
                                <SelectElement
                                    variant="standard"
                                    label="ルール"
                                    id="tournament-rule"
                                    name="tournamentRule"
                                    control={control}
                                    options={[
                                        { id: "bo3", label: "BO3" },
                                        { id: "bo5", label: "BO5" },
                                    ]}
                                />
                            </FormControl>
                            <Typography
                                variant="subtitle2"
                                sx={{ mt: 2, mb: 1 }}
                            >
                                ブランドロゴ
                            </Typography>
                            <TextFieldElement
                                id="tournament-icon"
                                name="tournamentLogo"
                                type="hidden"
                                control={control}
                                sx={{ display: "none" }}
                            />
                            <LogoPicker
                                logo={tournamentLogo}
                                onClickChange={() =>
                                    handleSelectIcon("tournamentLogo")
                                }
                                onClickReset={() =>
                                    setValue("tournamentLogo", "")
                                }
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </form>
        </Box>
    );
}
