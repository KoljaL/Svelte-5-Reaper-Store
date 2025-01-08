<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import ToggleTheme from '$lib/components/ToggleTheme.svelte';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	import '$lib/style/classless.css';
	import '$lib/style/app.css';
	import LogLocalStorage from '$lib/components/LogLocalStorage.svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	let current = $state(page);
</script>

<header>
	<h1>Svelte 5 Reaper Store Lib</h1>
	<h3>Base: {base}</h3>
	<nav>
		<a href="{base}/" aria-current={current.route.id === '/'}>Home</a>
		<a href="{base}/reaper" aria-current={current.route.id === '/reaper'}>Reaper</a>
		<a href="{base}/rich" aria-current={current.route.id === '/rich'}>Rich</a>
	</nav>
	<div class="toggle"></div>
	<ToggleTheme />
	<LogLocalStorage />
</header>

{@render children()}

<footer>
	<p>© 2022 Reaper Store</p>
</footer>

<style>
	.toggle {
		grid-area: toggle;
		display: flex;
		gap: 1rem;
	}
	header {
		display: grid;
		grid-template-areas: 'h1 loglocal' 'nav toggle';
		padding: 0.5rem;
	}
	h1 {
		grid-area: h1;
		margin: 0;
	}

	nav {
		grid-area: nav;
		display: flex;
		justify-content: left;
		align-items: end;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	nav a {
		text-decoration: none;
	}

	nav a:hover {
		text-decoration: underline;
	}
	nav a[aria-current='true'] {
		text-decoration: underline;
	}

	footer {
		padding: 1rem;
		text-align: center;
	}
</style>
