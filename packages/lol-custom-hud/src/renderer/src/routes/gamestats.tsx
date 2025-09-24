import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardProps,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { useGameStats } from "@renderer/hooks/useGameStats";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { GameStats } from "src/types";

export const Route = createFileRoute("/gamestats")({
    component: RouteComponent,
});

interface TeamDataCardProps extends CardProps {
    team: GameStats["blueTeam"];
    teamName: string;
}

type TeamStatsuKeys = keyof GameStats["blueTeam"];

const statLabels: Record<TeamStatsuKeys, string> = {
    kills: "合計キル数",
    golds: "合計ゴールド",
    turrets: "合計タレット破壊数",
    killHordes: "ヴォイドグラブキル数",
    killHeralds: "ヘラルドキル数",
    killBarons: "バロンキル数",
    dragons: "ドラゴンキル数",
    killAtakhans: "アタカンキル数",
    featsProgress: "チーム実績進捗",
    goldsRaw: "合計ゴールド(生)",
};

const omitKeys: TeamStatsuKeys[] = ["featsProgress", "goldsRaw"];

const TeamOvervieward: React.FC<TeamDataCardProps> = ({
    team,
    teamName,
    ...props
}): React.JSX.Element => {
    return (
        <Card {...props}>
            <CardHeader title={teamName} />
            <CardContent>
                <Grid container spacing={2}>
                    {(Object.keys(team) as TeamStatsuKeys[])
                        .filter((k) => !omitKeys.includes(k))
                        .map((key) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    {statLabels[key]}
                                </Typography>
                                <Typography variant="h6">
                                    {key === "dragons"
                                        ? team[key].length.toString()
                                        : String(team[key])}
                                </Typography>
                            </Grid>
                        ))}
                </Grid>
            </CardContent>
            <Divider />
            <CardContent>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    力の偉業
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            ファーストブラッド
                        </Typography>
                        <Typography variant="h6">
                            {team.featsProgress.firstBloods}/3
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            最初にタワーを破壊
                        </Typography>
                        <Typography variant="h6">
                            {team.featsProgress.firstBricks ? "達成" : "未達成"}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            モンスター討伐
                        </Typography>
                        <Typography variant="h6">
                            {team.featsProgress.killMonsters}/3
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardContent>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    デバッグ情報
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {`ゴールドOCR結果: ${team.goldsRaw}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

function RouteComponent(): React.JSX.Element {
    const { gameStats } = useGameStats();

    if (!gameStats) {
        return (
            <Box display={"flex"} height={"100%"}>
                <Typography
                    variant="h6"
                    sx={{ m: "auto" }}
                    color="text.secondary"
                >
                    ゲームクライアントが起動していません
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                ゲーム情報
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TeamOvervieward
                        teamName="ブルーチーム"
                        team={gameStats.blueTeam}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TeamOvervieward
                        teamName="レッドチーム"
                        team={gameStats.redTeam}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
