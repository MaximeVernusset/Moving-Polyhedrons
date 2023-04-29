import type { RgbColor } from "./RgbColor";

export interface Drawable {
    draw: (canvasRenderingContext: CanvasRenderingContext2D, colorOverride: RgbColor | undefined) => void;
}