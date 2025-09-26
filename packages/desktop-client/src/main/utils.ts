import path from "path";
import { app, screen } from "electron";
import { WindowState } from "../types";

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

// マルチモニター環境で保存済みウィンドウ位置・サイズを安全に復元する
export function adjustWindowStateToDisplays(
    windowState: WindowState,
): WindowState {
    const defaultWindowState: WindowState = {
        x: 100,
        y: 100,
        width: 900,
        height: 670,
    };

    type Rect = { x: number; y: number; width: number; height: number };
    const isContainedIn = (rect: Rect, area: Rect): boolean =>
        rect.x >= area.x &&
        rect.y >= area.y &&
        rect.x + rect.width <= area.x + area.width &&
        rect.y + rect.height <= area.y + area.height;

    const intersectionArea = (a: Rect, b: Rect): number => {
        const ix = Math.max(a.x, b.x);
        const iy = Math.max(a.y, b.y);
        const ax = Math.min(a.x + a.width, b.x + b.width);
        const ay = Math.min(a.y + a.height, b.y + b.height);
        const iw = Math.max(0, ax - ix);
        const ih = Math.max(0, ay - iy);
        return iw * ih;
    };

    const clamp = (val: number, min: number, max: number): number =>
        Math.min(Math.max(val, min), max);

    const windowRect: Rect = {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
    };

    const displays = screen.getAllDisplays();
    const workAreas: Rect[] = displays.map((d) => ({
        x: d.workArea.x,
        y: d.workArea.y,
        width: d.workArea.width,
        height: d.workArea.height,
    }));

    const containedIndex = workAreas.findIndex((area) =>
        isContainedIn(windowRect, area),
    );
    if (containedIndex >= 0) {
        return windowState; // どこかのディスプレイに完全に収まっている
    }

    // 交差面積最大のディスプレイを選択
    const scored = workAreas
        .map((area) => ({ area, score: intersectionArea(windowRect, area) }))
        .sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (!best || best.score === 0) {
        // 完全に画面外 -> 既定にリセット
        return { ...defaultWindowState };
    }

    // 最も交差しているディスプレイ内に収める
    const area = best.area;
    const newWidth = Math.min(windowRect.width, area.width);
    const newHeight = Math.min(windowRect.height, area.height);
    const newX = clamp(windowRect.x, area.x, area.x + area.width - newWidth);
    const newY = clamp(windowRect.y, area.y, area.y + area.height - newHeight);

    return { x: newX, y: newY, width: newWidth, height: newHeight };
}
