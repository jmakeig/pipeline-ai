<script>
	import EventForm from '$lib/components/EventForm.svelte';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<svelte:head>
	<title>New Event | Pipeline</title>
</svelte:head>

<h1>New Event</h1>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<EventForm preselectedEntity={data.preselectedEntity} action="?/default" />

<style>
	h1 {
		margin-bottom: 1.5rem;
	}

	.error {
		background-color: #fee;
		color: #c00;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
</style>
