<script>
	import CustomerForm from '$lib/components/CustomerForm.svelte';

	/** @type {{ form: import('./$types').ActionData }} */
	let { form } = $props();
</script>

<svelte:head>
	<title>New Customer | Pipeline</title>
</svelte:head>

<h1>New Customer</h1>

{#if form?.validation}
	<div class="errors">
		{#each form.validation as issue}
			<p class="error">{issue.message}</p>
		{/each}
	</div>
{/if}

<CustomerForm action="?/default" />

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
