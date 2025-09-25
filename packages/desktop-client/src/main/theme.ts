import fs from "fs";
import path from "path";
import * as z from "zod";
import { getResourcePath } from "./utils";
import sharp from "sharp";
import decompress from "decompress";
import { AddThemeResult } from "../types";
import { getThemeConfig, setThemeConfig } from "./store";

const ThemeManifestV1Schema = z.object({
    manifestVersion: z.literal(1),
    themeId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    version: z.string().min(1),
    author: z.string().optional(),
    authorUrl: z.string().url().optional(),
    website: z.string().url().optional(),
    license: z.string().optional(),
    licenseUrl: z.string().url().optional(),
});

type ThemeManifestV1 = z.infer<typeof ThemeManifestV1Schema>;

export function getThemesDirectory(): string {
    const resourcePath = getResourcePath();
    return path.join(resourcePath, "themes");
}

async function getThemeDataByPath(
    themePath: string,
    isTemp: boolean = false,
): Promise<ThemeManifestV1 | null> {
    const manifestPath = path.join(themePath, "manifest.json");
    const indexHtmlPath = path.join(themePath, "index.html");
    if (!fs.existsSync(manifestPath) || !fs.existsSync(indexHtmlPath)) {
        console.error(
            `index.html or manifest.json not found in theme path: ${themePath}`,
        );
        return null;
    }

    try {
        const raw = fs.readFileSync(manifestPath, "utf-8");
        const json = JSON.parse(raw);
        const parsed = ThemeManifestV1Schema.safeParse(json);
        if (!parsed.success) {
            throw new Error(
                `Invalid theme manifest format: ${JSON.stringify(
                    parsed.error.format(),
                )}`,
            );
        }

        if (!isTemp) {
            const dirName = path.basename(themePath);
            if (parsed.data.themeId !== dirName) {
                throw new Error(
                    `Theme ID and folder name do not match: ${parsed.data.themeId} !== ${dirName}`,
                );
            }
        }

        const data: ThemeManifestV1 = { ...parsed.data };
        if (data.thumbnail) {
            try {
                const thumbnailPath = path.join(themePath, data.thumbnail);
                if (fs.existsSync(thumbnailPath)) {
                    const buffer = await sharp(thumbnailPath)
                        .resize(640, 360, {
                            fit: "inside",
                            withoutEnlargement: true,
                        })
                        .jpeg({ quality: 80 })
                        .toBuffer();
                    data.thumbnail = `data:image/jpeg;base64,${buffer.toString(
                        "base64",
                    )}`;
                } else {
                    delete data.thumbnail;
                }
            } catch {
                delete data.thumbnail;
            }
        }

        return data;
    } catch (error) {
        console.error("Failed to read or parse theme manifest:", error);
        return null;
    }
}

export async function getThemes(): Promise<ThemeManifestV1[]> {
    const themesDir = getThemesDirectory();
    if (!fs.existsSync(themesDir)) return [];

    const manifests: ThemeManifestV1[] = [];

    const dirents = fs.readdirSync(themesDir, { withFileTypes: true });
    for (const dirent of dirents) {
        if (!dirent.isDirectory()) continue;
        const themeDir = path.join(themesDir, dirent.name);
        const themeData = await getThemeDataByPath(themeDir);
        if (themeData) {
            manifests.push(themeData);
        }
    }

    return manifests;
}

export function getThemePathById(themeId: string): string | null {
    const themesDir = getThemesDirectory();
    const themePath = path.join(themesDir, themeId);
    return fs.existsSync(themePath) ? themePath : null;
}

export async function getThemeDataById(
    themeId: string,
): Promise<ThemeManifestV1 | null> {
    const themes = await getThemes();
    return themes.find((t) => t.themeId === themeId) || null;
}

let versionUpMode = false;

export async function addThemeFromZip(
    zipPath: string,
): Promise<AddThemeResult> {
    if (versionUpMode) {
        return {
            result: false,
            error: "現在バージョンアップ処理が進行中です。",
        };
    }
    const tempThemeDir = path.join(getThemesDirectory(), "_temp_theme_");
    // 一時ディレクトリを作成
    if (!fs.existsSync(tempThemeDir)) {
        fs.mkdirSync(tempThemeDir, { recursive: true });
    }

    try {
        // バージョンアップの場合は一時ディレクトリにファイルを置いたままにして、バージョンアップ関数を別で呼び出すようにする。
        try {
            await decompress(zipPath, tempThemeDir);
        } catch (error) {
            console.error("Failed to decompress theme zip:", error);
            return {
                result: false,
                error: "ZIPファイルの解凍に失敗しました。",
            };
        }

        const themeData = await getThemeDataByPath(tempThemeDir, true);
        if (!themeData) {
            fs.rmSync(tempThemeDir, { recursive: true, force: true });
            return { result: false, error: "テーマの情報が正しくありません。" };
        }

        const existingTheme = await getThemeDataById(themeData.themeId);
        if (existingTheme) {
            const existingVersion = existingTheme.version;
            const newVersion = themeData.version;
            if (existingVersion === newVersion) {
                fs.rmSync(tempThemeDir, { recursive: true, force: true });
                return {
                    result: false,
                    error: "同じバージョンのテーマが既に存在します。",
                };
            } else {
                // バージョンアップ (ここでは何もしない)
                versionUpMode = true;
                return { result: true, theme: themeData, isVersionUp: true };
            }
        } else {
            // 新規追加
            const themeDir = path.join(getThemesDirectory(), themeData.themeId);
            fs.renameSync(tempThemeDir, themeDir);
            return { result: true, theme: themeData, isVersionUp: false };
        }
    } catch (error) {
        console.error("Failed to add theme from zip:", error);
        if (fs.existsSync(tempThemeDir)) {
            fs.rmSync(tempThemeDir, { recursive: true, force: true });
        }
        return { result: false, error: "テーマの追加に失敗しました。" };
    }
}

export function cancelVersionUp(): void {
    versionUpMode = false;
    const tempThemeDir = path.join(getThemesDirectory(), "_temp_theme_");
    if (fs.existsSync(tempThemeDir)) {
        fs.rmSync(tempThemeDir, { recursive: true, force: true });
    }

    return;
}
export async function completeVersionUp(): Promise<AddThemeResult> {
    if (!versionUpMode) {
        return {
            result: false,
            error: "現在バージョンアップ処理は進行していません。",
        };
    }
    const tempThemeDir = path.join(getThemesDirectory(), "_temp_theme_");
    const themeData = await getThemeDataByPath(tempThemeDir, true);
    if (!themeData) {
        versionUpMode = false;
        fs.rmSync(tempThemeDir, { recursive: true, force: true });
        return { result: false, error: "テーマの情報が正しくありません。" };
    }
    const existingTheme = await getThemeDataById(themeData.themeId);
    if (!existingTheme) {
        versionUpMode = false;
        fs.rmSync(tempThemeDir, { recursive: true, force: true });
        return { result: false, error: "既存のテーマが見つかりません。" };
    }
    const existingThemeDir = path.join(
        getThemesDirectory(),
        existingTheme.themeId,
    );
    if (fs.existsSync(existingThemeDir)) {
        fs.rmSync(existingThemeDir, { recursive: true, force: true });
    }
    const themeDir = path.join(getThemesDirectory(), themeData.themeId);
    fs.renameSync(tempThemeDir, themeDir);
    versionUpMode = false;
    return { result: true, theme: themeData, isVersionUp: true };
}

export function deleteThemeById(themeId: string): boolean {
    const themeDir = path.join(getThemesDirectory(), themeId);
    if (fs.existsSync(themeDir)) {
        fs.rmSync(themeDir, { recursive: true, force: true });
        return true;
    }
    return false;
}

export async function getDefaultTheme(): Promise<ThemeManifestV1> {
    const themeId = "com.example.default";
    const themeData = await getThemeDataById(themeId);
    if (themeData) {
        return themeData;
    } else {
        throw new Error(`Default theme not found: ${themeId}`);
    }
}

export async function getCurrentThemeSafe(): Promise<ThemeManifestV1> {
    const config = getThemeConfig();

    try {
        const themeData = await getThemeDataById(config.themeId);
        if (themeData) {
            return themeData;
        } else {
            setThemeConfig({ themeId: "com.example.default" });
            return getDefaultTheme();
        }
    } catch (error) {
        console.error("Error getting current theme:", error);
        setThemeConfig({ themeId: "com.example.default" });
        return getDefaultTheme();
    }
}
