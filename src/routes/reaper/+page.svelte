<script lang="ts">
	import { ReaperStore } from '$lib/reaperStore.svelte';

	// import { onMount } from 'svelte';
	// let notesStore: ReaperStore<{ id: number; text: string }[]>;
	// let titleStore: ReaperStore<string> | { value: string };
	// titleStore = { value: 'Svelte-ReaPer-Store' };
	// onMount(() => {
	// 	notesStore = ReaperStore.createWithPrefix('myApp', 'notesStore', [{ id: 1, text: 'Note 1' }]);
	// 	titleStore = ReaperStore.createWithPrefix('ReaPer:', 'Title', 'Svelte-ReaPer-Store');
	// });

	const notesStore = ReaperStore.createWithPrefix('myApp', 'notesStore', [
		{ id: 1, text: 'Note 1' }
	]);
	const titleStore = ReaperStore.createWithPrefix('ReaPer:', 'Title', 'Svelte-ReaPer-Store');

	function addNote() {
		notesStore.value = [
			...(notesStore.value || []),
			{ id: Date.now(), text: `Note ${notesStore.value.length + 1}` }
		];
	}

	// let title = $state(titleStore.value);
</script>

{#await titleStore then titleStore}
	title: {titleStore.value}
{/await}
<svelte:head>
	<title>{titleStore.value || 'Title'}</title>
</svelte:head>

<h2>Reaper Store</h2>

<p>This is a Library for Svelte 5 to create persistant and reactive stores.</p>

<div class="row">
	<div class="addNote col-5">
		<button id="addNote" onclick={addNote}>Add Note</button>
		<pre>
      {JSON.stringify(notesStore.value, null, 2)}
    </pre>
	</div>
	<div class="changeTitle col-5">
		<label>
			Edit page title
			<input type="text" bind:value={titleStore.value} />
		</label>
	</div>
</div>

<style>
	.addNote {
		padding: 1rem;
	}
	.changeTitle {
		padding: 1rem;
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
