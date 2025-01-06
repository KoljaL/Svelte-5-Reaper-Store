<script lang="ts">
	import type { PageData } from './$types.js';
	import { ReaperStore } from '$lib/reaperStore.svelte';

	let { data }: { data: PageData } = $props();

	const notesStore = ReaperStore.createWithPrefix('myApp', 'notesStore', [
		{ id: 1, text: 'Note 1' },
		{ id: 2, text: 'Note 2' },
		{ id: 3, text: 'Note 3' }
	]);
	function addNote() {
		notesStore.value = [
			...(notesStore.value || []),
			{ id: Date.now(), text: `Note ${notesStore.value.length + 1}` }
		];
	}

	// Create a ReaperStore instance for user preferences
	const userPreferences = new ReaperStore('user:preferences', {
		theme: 'light',
		fontSize: 16,
		notifications: true
	});

	// Synchronize changes for real-time interaction
	function toggleTheme() {
		userPreferences.value = {
			...userPreferences.value,
			theme: userPreferences.value.theme === 'light' ? 'dark' : 'light'
		};
		// toggle data-theme in the document
		document.documentElement.dataset.theme = userPreferences.value.theme;
	}
	$inspect(userPreferences.value);
</script>

<h2>Reaper Store</h2>

<p>This is a Library for Svelte 5 to create persistant and reactive stores.</p>

<button onclick={toggleTheme}>
	{userPreferences.value.theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
</button>

<label for="addNote">
	<button id="addNote" onclick={addNote}>Add Note</button>
</label>

<pre>
  {JSON.stringify(notesStore.value, null, 2)}
</pre>

<style>
	label {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
	pre {
		background: var(--cbg);
		border: 1px solid var(--cdark);
		border-radius: 0.5rem;
		overflow: scroll;
		max-height: 300px;
		font-size: 85%;
	}
</style>
