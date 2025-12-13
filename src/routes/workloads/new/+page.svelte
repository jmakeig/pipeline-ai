<script>
	import WorkloadForm from '$lib/components/WorkloadForm.svelte';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<svelte:head>
	<title>New Workload | Pipeline</title>
</svelte:head>

<h1>New Workload</h1>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if data.customers.length === 0}
	<p class="warning">You need to <a href="/customers/new">create a customer</a> first.</p>
{:else}
	<WorkloadForm
		customers={data.customers}
		workload={data.preselectedCustomer ? { label: '', name: '', customer: data.preselectedCustomer, workload: '', created_at: new Date(), updated_at: new Date() } : null}
		action="?/default"
	/>
{/if}

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

	.warning {
		background-color: #ffc;
		color: #660;
		padding: 0.75rem;
		border-radius: 4px;
	}

	.warning a {
		color: #0066cc;
	}
</style>
