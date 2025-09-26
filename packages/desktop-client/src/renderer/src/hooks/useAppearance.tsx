import React, { createContext, useContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { AppearanceConfig } from "src/types";
import i18n from "../i18n";

interface AppearanceContextType {
    appearanceConfig: AppearanceConfig;
    updateAppearanceConfig: (
        config: Partial<AppearanceConfig>,
    ) => Promise<void>;
}

const AppearanceContext = createContext<AppearanceContextType | null>(null);

export const useAppearance = (): AppearanceContextType => {
    const context = useContext(AppearanceContext);
    if (!context) {
        throw new Error("useAppearance must be used within AppearanceProvider");
    }
    return context;
};

interface AppearanceProviderProps {
    children: React.ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({
    children,
}) => {
    const [appearanceConfig, setAppearanceConfig] = useState<AppearanceConfig>({
        colorMode: "dark",
        language: "en",
    });

    useEffect(() => {
        // Load initial config
        window.api.getAppearanceConfig().then((config) => {
            setAppearanceConfig(config);
            i18n.changeLanguage(config.language);
        });
    }, []);

    const updateAppearanceConfig = async (
        config: Partial<AppearanceConfig>,
    ): Promise<void> => {
        const newConfig = { ...appearanceConfig, ...config };
        setAppearanceConfig(newConfig);
        await window.api.setAppearanceConfig(newConfig);

        if (config.language) {
            i18n.changeLanguage(config.language);
        }
    };

    const theme = createTheme({
        palette: {
            mode: appearanceConfig.colorMode,
            primary: {
                light: "#8561c5",
                main: "#673ab7",
                dark: "#482880",
                contrastText: "#fff",
            },
            secondary: {
                light: "#637bfe",
                main: "#3d5afe",
                dark: "#2a3eb1",
                contrastText: "#fff",
            },
        },
    });

    return (
        <AppearanceContext.Provider
            value={{ appearanceConfig, updateAppearanceConfig }}
        >
            <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
        </AppearanceContext.Provider>
    );
};
