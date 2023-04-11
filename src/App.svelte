<script lang="ts">
	import { onMount } from 'svelte';
    import { Line } from './types/Line';
	import type { Point } from './types/Point';
	import { RandomPoint } from './types/RandomPoint';

	const RENDER_INTERVAL: number = 10;

	let canvasHeight: number = window.innerHeight;
	let canvasWidth: number = window.innerWidth;

	let points: Point[] = [];
	let lines: Line[] = [];
	let animationId: number;
	let canvas: HTMLCanvasElement;
	let canvasRenderingContext: CanvasRenderingContext2D;

	$: SCREEN_RATIO = Math.max(window.outerHeight, window.outerWidth) / Math.min(window.outerHeight, window.outerWidth) * 100;
	$: NB_INITIAL_POINTS = Math.floor(Math.min(canvasWidth, canvasHeight) / Math.max(canvasWidth, canvasHeight) * SCREEN_RATIO * 2.5);
	$: MAX_DISTANCE_FOR_LINE = Math.min(Math.sqrt(NB_INITIAL_POINTS * SCREEN_RATIO), 100);

	$: updateCanvasSize(canvasWidth, canvasHeight);
	$: debugData({ 
		canvasHeight, 
		canvasWidth, 
		NB_INITIAL_POINTS, 
		MAX_DISTANCE_FOR_LINE 
	});

	function updateCanvasSize(width: number , height: number): void {
		if (canvas) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	function initPoints(): void {
		for (let i: number = 0; i < NB_INITIAL_POINTS; i++) {
			points.push(new RandomPoint(canvasWidth, canvasHeight));
		}
	}

	function debugData(data: object): void {
		Object.entries(data).forEach(([key, value]) => {
			console.debug(`${key} = ${value}`);
		});
	}

	function compute(): void {
		lines = [];

		for (let i: number = 0; i < points.length; i++) {
			const point1: Point = points[i];
			for (let j: number = i+1; j < points.length; j++) {
				const point2: Point = points[j]
				if (Line.computeDistance(point1, point2) <= MAX_DISTANCE_FOR_LINE) {
					lines.push(new Line(point1, point2));
				}
			}
		}
	}
 
	function startAnimation(): number {
		animationId = setInterval(() => {
			movePoints();
			compute();
			window.requestAnimationFrame(render);
		}, RENDER_INTERVAL);
		return animationId;
	}

	function stopAnimation(): void {
		clearInterval(animationId);
		animationId = null;
	}

	function render(timestamp: DOMHighResTimeStamp): void {
		canvasRenderingContext.clearRect(0, 0, canvas.width, canvas.height);
		for (let i=0; i<Math.max(points.length, lines.length); i++) {
			if (i < points.length) {
				points[i].draw(canvasRenderingContext);
			}
			if (i < lines.length) {
				lines[i].draw(canvasRenderingContext);
			}
		}
	}

	function movePoints(): void {
		points.forEach(point => {
			point.move();
		});
	}

	onMount((): void => {
		initPoints();
		canvasRenderingContext = canvas.getContext('2d');
		updateCanvasSize(canvasWidth, canvasHeight);
		toggleAnimation();
	});

	function resizeAndRender(): void {
		canvasWidth = window.innerWidth;
		canvasHeight = window.innerHeight;
		adjustPoints();
	}

	function adjustPoints(): void {
		const adjustedPoints: Point[] = points
			.filter(point => point.isInsideWindow(canvasWidth, canvasHeight))
			.slice(0, NB_INITIAL_POINTS);
		adjustedPoints.forEach(point => point.updateWindow(canvasWidth, canvasHeight));
		if (adjustedPoints.length < NB_INITIAL_POINTS) {
			for (let i: number = 0; i < NB_INITIAL_POINTS - adjustedPoints.length; i++) {
				adjustedPoints.push(new RandomPoint(canvasWidth, canvasHeight));
			}
		}
		points = adjustedPoints;
	}

	function toggleAnimation(): void {
		if (animationId) {
			stopAnimation();
		} else {
			startAnimation();
		}
	}

	function handleKeyPress(event): void {
		switch (event.key) {
			case ' ': toggleAnimation();
				break;
			default: break;
		}
	}

</script>

<style>
	canvas {
		background-color: rgb(0, 0, 0);
	}

	#animation {
		display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left;
	}
</style>

<svelte:window on:keypress="{handleKeyPress}" on:resize="{resizeAndRender}"></svelte:window>

<div id="animation">
	<canvas bind:this={canvas}></canvas>
</div>
