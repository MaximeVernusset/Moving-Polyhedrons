import './global.css';

import App from './App.svelte';

const app = new App({
	target: document.getElementById('canvas'),
	props: {
		canvasHeight: window.innerHeight,
		canvasWidth: window.innerWidth,
	}
});

export default app;
