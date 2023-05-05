import { Colors } from "./Colors";
import { Peak } from "./Peak";
import type { Drawable } from "./Drawable";
import type { RgbColor } from "./RgbColor";

export const DEFAULT_COLOR = Colors.WHITE;
export const DEFAULT_RADIUS = 1.1;

const FULL_CIRCLE_ANGLE = Math.PI * 2;
const START_CIRCLE_ANGLE = 0;
const SCALE = 1;

export class Point extends Peak implements Drawable {

    private _x: number;
    private _y: number;
    private dx: number;
    private dy: number;
    private xMax: number;
    private yMax: number;
    private color: RgbColor;
    private radius: number;

    constructor(x: number, y: number, dx: number, dy: number, xMax: number, yMax: number, color: RgbColor = DEFAULT_COLOR, radius: number = DEFAULT_RADIUS) {
        super();
        this._x = x;
        this._y = y;
        this.dx = dx;
        this.dy = dy;
        this.xMax = xMax;
        this.yMax = yMax;
        this.color = color;
        this.radius = radius;
    }

    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }

    move(): void {
        this.bounce();
        this.incrementPositionGivenSpeed();
    }

    draw(canvasRenderingContext: CanvasRenderingContext2D, colorOverride: RgbColor | undefined = undefined): void {
        canvasRenderingContext.beginPath();
        canvasRenderingContext.fillStyle = (colorOverride || this.color).getRgba();
        canvasRenderingContext.arc(this.x, this.y, this.radius, START_CIRCLE_ANGLE, FULL_CIRCLE_ANGLE);
        canvasRenderingContext.scale(SCALE, SCALE);
        canvasRenderingContext.fill();
    }

    updateWindow(width: number, height: number): void {
        this.xMax = width;
        this.yMax = height;
    }

    isInsideWindow(width: number, height: number): boolean {
        return !this.isHorizontallyOutsideWindow(width)
            && !this.isVerticallyOutsideWindow(height);
    }

    private incrementPositionGivenSpeed(): void {
        this._x += this.dx;
        this._y += this.dy;
    }

    private bounce(): void {
        if (this.isHorizontallyOutsideWindow()) {
            this.invertHorizontalSpeed();
        }
        if (this.isVerticallyOutsideWindow()) {
            this.invertVerticalSpeed();
        }
    }

    private isHorizontallyOutsideWindow(xMaxOverride: number | undefined = undefined): boolean {
        return this.x - this.radius <= 0 
            || this.x + this.radius >= (xMaxOverride || this.xMax);
    }

    private isVerticallyOutsideWindow(yMaxOverride: number | undefined = undefined): boolean {
        return this.y - this.radius <= 0 
            || this.y + this.radius >= (yMaxOverride || this.yMax);
    }

    private invertHorizontalSpeed(): void {
        this.dx *= -1;
    }

    private invertVerticalSpeed(): void {
        this.dy *= -1;
    }

}