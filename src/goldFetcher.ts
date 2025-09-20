import { Image, Window } from "node-screenshots";
import Tesseract from "tesseract.js";
import sharp from "sharp";

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
    // 数字、ドット、小文字のk、または大文字のK以外の文字を削除
    let cleaned = s.replace(/[^0-9.kK]/g, "");
    // ドットが複数ある場合、最初のドット以外を削除
    const parts = cleaned.split(".");
    if (parts.length > 1) cleaned = parts.shift()! + "." + parts.join("");
    // 大文字のKを小文字のkに変換
    cleaned = cleaned.replace(/K/g, "k");
    return cleaned.trim();
}

async function imageToGold(image: Image): Promise<string> {
    const buffer = await image.toPng();
    const greyBuffer = await preprocess(buffer);
    const result = await runOCR(greyBuffer);
    return sanitizeGold(result);
}

export async function getTotalGold() {
    const Title = "League of Legends (TM) Client";
    let windows = Window.all().find((w) => w.title === Title);
    if (!windows) {
        console.log("League of Legends client window not found.");
        return;
    }

    const image = await windows.captureImage();
    const orderGoldTextImage: Image = await image.crop(800, 15, 60, 25);
    const chaosGoldTextImage: Image = await image.crop(1104, 15, 60, 25);

    const [orderGold, chaosGold] = await Promise.all([
        imageToGold(orderGoldTextImage),
        imageToGold(chaosGoldTextImage),
    ]);

    return { orderGold, chaosGold };
}
