import type { RgbColor } from "./RgbColor";
import type { Point } from "./Point";
import type { Drawable } from "./Drawable";
import { Colors } from "./Colors";
import { Edge } from "./Edge";

const DEFAULT_COLOR = Colors.GREEN;

export class Line extends Edge implements Drawable {

    private startPoint: Point;
    private endPoint: Point;
    private color: RgbColor;
    private size: number;

    constructor(startPoint: Point, endPoint: Point, color: RgbColor = DEFAULT_COLOR) {
        super(startPoint, endPoint);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.color = color;
        this.size = Line.computeDistance(startPoint, endPoint);
    }

    static computeDistance(startPoint: Point, endPoint: Point) {
        return Math.sqrt(
            (endPoint.x - startPoint.x) * (endPoint.x - startPoint.x)
            + (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y));
    }

    draw(canvasRenderingContext: CanvasRenderingContext2D, colorOverride: RgbColor | undefined = undefined, colorAlpha: number | undefined = undefined): void {
        const color = colorOverride || this.color;
        canvasRenderingContext.strokeStyle = color.getRgba(colorAlpha || 1 - this.size / 100);
        canvasRenderingContext.beginPath();
        canvasRenderingContext.moveTo(this.startPoint.x, this.startPoint.y);
        canvasRenderingContext.lineTo(this.endPoint.x, this.endPoint.y);     
        canvasRenderingContext.stroke();
    }

}