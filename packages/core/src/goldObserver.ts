import { Image, Window } from "node-screenshots";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import EventEmitter from "events";

const OrderGoldPosition = { x: 800, y: 15, width: 60, height: 25 };
const ChaosGoldPosition = { x: 1104, y: 15, width: 60, height: 25 };

export interface GoldObserverOptions {
    intervalMs?: number;
    windowTitle?: string;
}

export enum GoldObserverEvents {
    Connected = "connected",
    GoldChange = "goldChange",
    Disconnected = "disconnected",
}

export type GoldObserverEventsListener = {
    [GoldObserverEvents.Connected]: () => void;
    [GoldObserverEvents.GoldChange]: (
        blueGold: string,
        redGold: string,
    ) => void;
    [GoldObserverEvents.Disconnected]: () => void;
};

export class GoldObserver {
    private intervalId: NodeJS.Timer | null = null;
    private _blueGold: string = "";
    private _redGold: string = "";
    private eventEmitter = new EventEmitter();
    private connected: boolean = false;
    private destroyed: boolean = false;
    private window: Window | null = null;

    constructor(private options: GoldObserverOptions = {}) {
        if (!this.options.intervalMs) this.options.intervalMs = 500;
        if (!this.options.windowTitle)
            this.options.windowTitle = "League of Legends (TM) Client";
    }

    get blueGold() {
        return this._blueGold;
    }

    get redGold() {
        return this._redGold;
    }

    on<T extends GoldObserverEvents>(
        event: T,
        listener: GoldObserverEventsListener[T],
    ) {
        this.eventEmitter.on(event, listener);
    }

    once<T extends GoldObserverEvents>(
        event: T,
        listener: GoldObserverEventsListener[T],
    ) {
        this.eventEmitter.once(event, listener);
    }

    off<T extends GoldObserverEvents>(
        event: T,
        listener: GoldObserverEventsListener[T],
    ) {
        this.eventEmitter.off(event, listener);
    }

    start() {
        if (this.intervalId) return; // すでに開始している場合は無視
        this.main();
    }

    destroy() {
        if (this.destroyed) return;
        if (this.intervalId) {
            clearInterval(Number(this.intervalId));
        }
        this.destroyed = true;
        this.intervalId = null;
        this.connected = false;
        this.eventEmitter.emit(GoldObserverEvents.Disconnected);
    }

    private main() {
        this.intervalId = setInterval(async () => {
            await this.fetchGold().catch(() => {
                this.destroy();
            });
        }, this.options.intervalMs);
    }

    private async fetchGold() {
        try {
            if (!this.window) {
                const window = Window.all().find(
                    (w) => w.title === this.options.windowTitle,
                );
                if (!window) {
                    this.destroy();
                    return;
                }
                this.window = window;
            }

            const image = await this.window.captureImage();
            const orderGoldTextImage: Image = await image.crop(
                OrderGoldPosition.x,
                OrderGoldPosition.y,
                OrderGoldPosition.width,
                OrderGoldPosition.height,
            );
            const chaosGoldTextImage: Image = await image.crop(
                ChaosGoldPosition.x,
                ChaosGoldPosition.y,
                ChaosGoldPosition.width,
                ChaosGoldPosition.height,
            );

            const [orderGold, chaosGold] = await Promise.all([
                imageToGold(orderGoldTextImage),
                imageToGold(chaosGoldTextImage),
            ]);

            const checkGoldFormat = (gold: string) => {
                // 12.3k, 23.4K などの形式を許容
                return /^(\d{1,3}(\.\d)?k?)$/.test(gold);
            };

            let updated = false;

            if (checkGoldFormat(orderGold) && this._blueGold !== orderGold) {
                this._blueGold = orderGold;
                updated = true;
            }

            if (checkGoldFormat(chaosGold) && this._redGold !== chaosGold) {
                this._redGold = chaosGold;
                updated = true;
            }

            if (updated) this.emitGoldChange(this._blueGold, this._redGold);

            this.emitConnected();
        } catch (e) {
            throw "Failed to fetch gold data: " + e;
        }
    }

    private emitGoldChange(blueGold: string, redGold: string) {
        this.eventEmitter.emit(
            GoldObserverEvents.GoldChange,
            blueGold,
            redGold,
        );
    }

    private emitConnected() {
        if (!this.connected) {
            this.connected = true;
            this.eventEmitter.emit("connected");
        }
    }
}

async function preprocess(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
        .grayscale() // グレースケール化
        .linear(1.2, -30) // コントラスト調整 (a=倍率, b=オフセット)
        .toBuffer();
}

async function runOCR(buffer: Buffer): Promise<string> {
    const result = await Tesseract.recognize(buffer, "eng");
    return result.data.text.trim();
}

function sanitizeGold(s: string): string {
    if (!s) return "";
    // 12.3k, 23.4K など、kの違いのみを許容。必ず\d{1,3}\.\d[k,K]の形式ではない場合は空文字を返す
    const cleaned = s.replace(/[^0-9kK.]/g, "");
    if (!/^(\d{1,3}\.\d[kK])$/.test(cleaned)) return "";

    // kを大文字に統一
    const upperK = cleaned.replace(/k/g, "K");

    return upperK;
}

async function imageToGold(image: Image): Promise<string> {
    const buffer = await image.toPng();
    const greyBuffer = await preprocess(buffer);
    const result = await runOCR(greyBuffer);
    return sanitizeGold(result);
}
