import { Line } from './Line';
import type { Point } from './Point';
import { RandomPoint } from './RandomPoint';
import { Colors } from './Colors';
import type { RgbColor } from './RgbColor';
import type { EventData } from './EventData';

const RENDER_INTERVAL = 10;

export type { RgbColor };
export { Colors };
export { EVENTS } from './Events';

export class MovingPolyhedrons {

	private canvasHeight: number;
	private canvasWidth: number;
	private screenRatio: number;
	private distanceForLine: number;

	private nbPoints: number;
	private pointsColor: RgbColor;
	private linesColor: RgbColor;

	private points: Point[] = [];
	private lines: Line[] = [];
	private movingAnimationId: number = null;
	private renderingAnimationId: number = null;
	private stroboscopeModeAnimationId: number = null;
	private canvas: HTMLCanvasElement;
	private canvasRenderingContext: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement,
		canvasHeight: number = window.innerHeight, 
		canvasWidth: number = window.innerWidth,
		pointsColor: RgbColor = Colors.WHITE,
		linesColor: RgbColor = Colors.GREEN,
		nbInitialPoints: number | undefined = undefined
	) {
		this.canvas = canvas;
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;
		this.canvasRenderingContext = canvas.getContext('2d');
		this.pointsColor = pointsColor;
		this.linesColor = linesColor;
		this.screenRatio = this.computeScreenRatio();
		this.nbPoints = nbInitialPoints || this.computeNbPoints();
		this.distanceForLine = this.computeMaxDistanceForLine();
	}

	private computeScreenRatio(): number {
		return Math.max(window.outerHeight, window.outerWidth) / Math.min(window.outerHeight, window.outerWidth) * 100;
	}

	private computeNbPoints(): number {
		return Math.floor(
			Math.min(this.canvasWidth, this.canvasHeight) / Math.max(this.canvasWidth, this.canvasHeight) * this.screenRatio * 2.5
		);
	}

	private computeMaxDistanceForLine(): number {
		return Math.min(Math.sqrt(this.nbPoints * this.screenRatio), 100);
	}

	start(): void {
		this.initPoints();
		this.updateCanvasSize(this.canvasWidth, this.canvasHeight);
		this.toggleAnimation();
	}
	
	private toggleAnimation(): void {
		if (this.movingAnimationId) {
			this.stopAnimation();
		} else {
			this.startAnimation();
		}
	}

	receiveEvent(name: string, data: EventData | undefined = undefined): boolean {
		const eventHandler = this[name];
		if (eventHandler) {
			eventHandler.bind(this)(data.data);
			return true;
		}
		console.warn(`${name} event is not handled`, data.event);
		return false;
	}

	private updateCanvasSize(width: number , height: number): void {
		if (this.canvas) {
			this.canvasWidth = width;
			this.canvasHeight = height;
			this.canvas.width = width;
			this.canvas.height = height;
		}
	}

	private initPoints(): void {
		for (let i = 0; i < this.nbPoints; i++) {
			this.points.push(new RandomPoint(this.canvasWidth, this.canvasHeight, this.pointsColor));
		}
	}

	private compute(): void {
		this.lines = [];

		for (let i = 0; i < this.points.length; i++) {
			const point1: Point = this.points[i];
			for (let j = i+1; j < this.points.length; j++) {
				const point2: Point = this.points[j]
				if (Line.computeDistance(point1, point2) <= this.distanceForLine) {
					this.lines.push(new Line(point1, point2, this.linesColor));
				}
			}
		}
	}
 
	private startAnimation(): number {
		if (!this.renderingAnimationId) {
			this.renderingAnimationId = setInterval(() => {
				this.compute();
				this.render();
			}, RENDER_INTERVAL);
		}
		this.movingAnimationId = setInterval(() => {
			this.movePoints();
		}, RENDER_INTERVAL);
		return this.movingAnimationId;
	}

	private stopAnimation(): void {
		clearInterval(this.movingAnimationId);
		this.movingAnimationId = null;
	}

	private render(): void {
		this.canvasRenderingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < Math.max(this.points.length, this.lines.length); i++) {
			if (i < this.points.length) {
				this.points[i].draw(this.canvasRenderingContext, this.pointsColor);
			}
			if (i < this.lines.length) {
				this.lines[i].draw(this.canvasRenderingContext, this.linesColor);
			}
		}
	}

	private movePoints(): void {
		this.points.forEach(point => {
			point.move();
		});
	}

	private resize(): void {
		this.updateCanvasSize(window.innerWidth, window.innerHeight);
		this.screenRatio = this.computeScreenRatio();
		this.adjustPoints();
	}

	private changeLinesColor(newColor: RgbColor): void {
		this.stopStroboscope();
		this.linesColor = newColor;
	}
	
	private stroboscopeMode(colorChangeInterval: number = RENDER_INTERVAL * 10): void {
		this.stopStroboscope();
		this.stroboscopeModeAnimationId = setInterval(() => {
			const colorsNumber: number = Object.keys(Colors).length;
			const randomColorIndex = Math.floor((Math.random() * 1000) % colorsNumber);
			const newColor: RgbColor = Object.entries(Colors)[randomColorIndex][1];
			this.linesColor = newColor;
		}, colorChangeInterval);
	}

	private stopStroboscope(): void  {
		clearInterval(this.stroboscopeModeAnimationId);
	}

	private addPoints(nbToAdd: number): void {
		for (let i = 0; i < nbToAdd; i++) {
			this.points.push(new RandomPoint(this.canvasWidth, this.canvasHeight));
		}
	}

	private removePoints(nbToRemove: number): void {
		this.points = this.points.slice(0, this.points.length - (nbToRemove + 1));
	}

	private invertDirection(): void {
		this.points.forEach(point => point.invertSpeed());
	}

	private adjustPoints(): void {
		const adjustedPoints: Point[] = this.points
			.filter(point => point.isInsideWindow(this.canvasWidth, this.canvasHeight))
			.slice(0, this.nbPoints);
		adjustedPoints.forEach(point => point.updateWindow(this.canvasWidth, this.canvasHeight));
		if (adjustedPoints.length < this.nbPoints) {
			for (let i = 0; i < this.nbPoints - adjustedPoints.length; i++) {
				adjustedPoints.push(new RandomPoint(this.canvasWidth, this.canvasHeight));
			}
		}
		this.points = adjustedPoints;
	}

}