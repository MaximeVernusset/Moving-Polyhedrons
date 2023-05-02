<script lang="ts">

	import { onMount } from 'svelte';
	import { MovingPolyhedrons, EVENTS } from './MovingPolyhedrons/MovingPolyhedrons';
	import { Colors } from './MovingPolyhedrons/Colors';
	import type { RgbColor } from './MovingPolyhedrons/RgbColor';

	const KEYPRESSED_HANDLERS = {
		' ': toggleAnimation,
		'+': add5Points,
		'-': remove5Points,
		's': stroboscopeMode,
		'r': changeLinesColor(Colors.RED),
		'g': changeLinesColor(Colors.GREEN),
		'b': changeLinesColor(Colors.BLUE),
		'h': changeLinesColor(Colors.GRAY),
		'c': changeLinesColor(Colors.CYAN),
		'm': changeLinesColor(Colors.MAGENTA),
		'y': changeLinesColor(Colors.YELLOW),
		'w': changeLinesColor(Colors.WHITE),
		'p': changeLinesColor(Colors.BLACK)
	}

	let canvas: HTMLCanvasElement;
	let app: MovingPolyhedrons;

	onMount((): void => {
		app = new MovingPolyhedrons(canvas);
		app.start();
	});

	function handleKeyPress(event: any): void {
		const functionToCall = KEYPRESSED_HANDLERS[event.key];
		if (functionToCall) {
			functionToCall(event);
		}
	}

	function changeLinesColor(color: RgbColor) {
		return function(event: any) {
			app.receiveEvent(EVENTS.CHANGE_LINES_COLOR, { data: color, event });
		}
	}

	function resize(event: any): void {
		app.receiveEvent(EVENTS.RESIZE, { event });
	}

	function toggleAnimation(event: any): void {
		app.receiveEvent(EVENTS.TOGGLE_ANIMATION, { event });
	}

	function stroboscopeMode(event: any): void {
		app.receiveEvent(EVENTS.STROBOSCOPE_MODE, { event });
	}

	function add5Points(event: any): void {
		app.receiveEvent(EVENTS.ADD_POINTS, { event, data: 5 });
	}

	function remove5Points(event: any): void {
		app.receiveEvent(EVENTS.REMOVE_POINTS, { event, data: 5 });
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

<svelte:window on:keypress="{handleKeyPress}" on:resize="{resize}"></svelte:window>

<div id="animation">
	<canvas bind:this={canvas}></canvas>
</div>
