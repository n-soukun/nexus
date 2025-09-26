export interface ThemeConfig {
    themeId: string;
}

export interface ThemeManifestV1 {
    manifestVersion: 1;
    themeId: string;
    name: string;
    description?: string;
    thumbnail?: string;
    width: number;
    height: number;
    version: string;
    author?: string;
    authorUrl?: string;
    website?: string;
    license?: string;
    licenseUrl?: string;
}

export type AddThemeResult =
    | {
          result: true;
          theme: ThemeManifestV1;
          isVersionUp: boolean;
      }
    | { result: false; error: string };
