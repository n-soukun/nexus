import path from "path";
import { app } from "electron";

const isDev = !app.isPackaged;

export function getResourcePath(): string {
    if (isDev) {
        return path.join(__dirname, "../../resources");
    } else {
        return path.join(
            process.resourcesPath,
            "app.asar.unpacked",
            "resources",
        );
    }
}
