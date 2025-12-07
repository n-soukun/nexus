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
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/gamestats")({
    component: RouteComponent,
});

interface TeamDataCardProps extends CardProps {
    team: GameStats["blueTeam"];
    teamName: string;
}

type TeamStatsuKeys = keyof GameStats["blueTeam"];

const statKeyToI18nKey: Record<TeamStatsuKeys, string> = {
    kills: "gamestats.kills",
    golds: "gamestats.golds",
    turrets: "gamestats.turrets",
    killHordes: "gamestats.killHordes",
    killHeralds: "gamestats.killHeralds",
    killBarons: "gamestats.killBarons",
    dragons: "gamestats.dragons",
    killAtakhans: "gamestats.killAtakhans",
    featsProgress: "gamestats.featsProgress",
    goldsRaw: "gamestats.goldsRaw",
};

const omitKeys: TeamStatsuKeys[] = ["featsProgress", "goldsRaw"];

const TeamOvervieward: React.FC<TeamDataCardProps> = ({
    team,
    teamName,
    ...props
}): React.JSX.Element => {
    const { t } = useTranslation();
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
                                    {t(statKeyToI18nKey[key])}
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
                    {t("gamestats.powerFeats")}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t("gamestats.firstBlood")}
                        </Typography>
                        <Typography variant="h6">
                            {team.featsProgress.firstBloods}/3
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t("gamestats.firstBrick")}
                        </Typography>
                        <Typography variant="h6">
                            {team.featsProgress.firstBricks
                                ? t("gamestats.achieved")
                                : t("gamestats.notAchieved")}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {t("gamestats.monsterHunt")}
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
                    {t("gamestats.debugInfo")}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {`${t("gamestats.goldOcrResult")}: ${team.goldsRaw}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

function RouteComponent(): React.JSX.Element {
    const { gameStats } = useGameStats();
    const { t } = useTranslation();

    if (!gameStats) {
        return (
            <Box display={"flex"} height={"100%"}>
                <Typography
                    variant="h6"
                    sx={{ m: "auto" }}
                    color="text.secondary"
                >
                    {t("gamestats.clientNotRunning")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t("screenTitle.gameInfo")}
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TeamOvervieward
                        teamName={t("gamestats.blueTeam")}
                        team={gameStats.blueTeam}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TeamOvervieward
                        teamName={t("gamestats.redTeam")}
                        team={gameStats.redTeam}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
