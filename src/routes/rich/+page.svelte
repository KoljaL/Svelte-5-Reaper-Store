<script lang="ts">
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	import { LocalStorage } from './rich.svelte';

	const box = new LocalStorage('box', {
		color: '#ff3e00',
		dimensions: [10, 10]
	});

	function randomBox() {
		box.current = {
			color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
			dimensions: [Math.floor(Math.random() * 400) + 100, Math.floor(Math.random() * 400) + 100]
		};
	}
</script>

<h2>Rich</h2>

<p>
	This page uses the <a href="https://github.com/Rich-Harris/local-storage-test"
		>local-storage-test</a
	> from Rich Harris.
</p>

<h3>Adjust the settings or click the random button</h3>

<button on:click={randomBox}>Random</button>
<div class="set">
	<label>
		<input type="color" bind:value={box.current.color} />
		color
	</label>

	<label>
		<input type="range" bind:value={box.current.dimensions[0]} min={100} max={500} />
		width
	</label>

	<label>
		<input type="range" bind:value={box.current.dimensions[1]} min={100} max={500} />
		height
	</label>
</div>

<div
	class="box"
	style:background={box.current.color}
	style:width="{box.current.dimensions[0]}px"
	style:height="{box.current.dimensions[1]}px"
></div>

<style>
	.set {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1em;
	}
	label {
		display: flex;
		flex-direction: column-reverse;
		gap: 0.5em;
	}
</style>
