<script lang="ts">
	import { onMount } from 'svelte';
    import { Colors } from './types/Colors';
    import { Line } from './types/Line';
	import type { Point } from './types/Point';
	import { RandomPoint } from './types/RandomPoint';

	export let canvasHeight: number = window.innerHeight;
	export let canvasWidth: number = window.innerWidth;

	const SCREEN_RATIO = Math.max(window.outerHeight, window.outerWidth) / Math.min(window.outerHeight, window.outerWidth) * 100;
	const NB_INITIAL_POINTS: number = Math.floor(Math.min(canvasWidth, canvasHeight) / Math.max(canvasWidth, canvasHeight) * SCREEN_RATIO * 2.5);
	const MAX_DISTANCE_FOR_LINE: number = Math.min(Math.sqrt(NB_INITIAL_POINTS * SCREEN_RATIO), 100);

	const RENDER_INTERVAL: number = 10;

	let points: Point[] = [];
	let lines: Line[] = [];
	let animationId: number;
	let canvas: HTMLCanvasElement;
	let canvasRenderingContext: CanvasRenderingContext2D;

	function initPoints(): void {
		for (let i=0; i<NB_INITIAL_POINTS; i++) {
			points.push(new RandomPoint(canvasWidth, canvasHeight));
		}
	}

	function logInitializationData() {
		console.log(`canvasHeight = ${canvasHeight}`);
		console.log(`canvasWidth = ${canvasWidth}`);
		console.log(`NB_INITIAL_POINTS = ${NB_INITIAL_POINTS}`);
		console.log(`MAX_DISTANCE_FOR_LINE = ${MAX_DISTANCE_FOR_LINE}`);
	}

	function compute(): void {
		lines = [];

		for (let i=0; i<points.length; i++) {
			const point1: Point = points[i];
			for (let j=i+1; j<points.length; j++) {
				const point2: Point = points[j]
				if (Line.computeDistance(point1, point2) <= MAX_DISTANCE_FOR_LINE) {
					lines.push(new Line(point1, point2));
				}
			}
		}
	}
 
	function startAnimation(): number {
		return setInterval(() => {
			movePoints();
			compute();
			window.requestAnimationFrame(render);
		}, RENDER_INTERVAL);
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
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		logInitializationData();
	});
	animationId = startAnimation();

	function resizeAndRender() {
		console.debug("Window resized");
		// TODO
	}

	function toggleAnimation() {
		if (animationId) {
			clearInterval(animationId);
			animationId = null;
		} else {
			animationId = startAnimation();
		}
	}

	function handleKeyPress(event) {
		switch(event.key) {
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
