<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
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
	<nav>
		<a href="{base}/" aria-current={current.route.id === '/'}>Home</a>
		<a href="{base}/reaper" aria-current={current.route.id === '/reaper'}>Reaper</a>
		<a href="{base}/rich" aria-current={current.route.id === '/rich'}>Rich</a>
	</nav>
	<LogLocalStorage />
</header>

{@render children()}

<footer>
	<p>© 2022 Reaper Store</p>
</footer>

<style>
	header {
		padding: 1rem;
	}
	h1 {
		margin: 0;
	}

	nav {
		display: flex;
		justify-content: left;
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
