<script>
	import { STAGES } from '$lib/constants.js';

	/** @type {{ value: import('$lib/types').Stage | null, name?: string, id?: string, required?: boolean }} */
	let { value = $bindable(null), name = 'stage', id = 'stage', required = false } = $props();
</script>

<select {name} {id} {required} bind:value>
	<option value={null}>-- Select stage --</option>
	{#each STAGES as stage}
		<option value={stage.value}>{stage.label}</option>
	{/each}
</select>

<style>
	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		background-color: white;
	}

	select:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
	}
</style>
