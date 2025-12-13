<script>
	import CustomerForm from '$lib/components/CustomerForm.svelte';
	import { formatDateTime, getStageInfo, formatCurrency } from '$lib/constants.js';

	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.customer.name} | Pipeline</title>
</svelte:head>

<div class="page-header">
	<h1>{data.customer.name}</h1>
	<form method="POST" action="?/delete" class="delete-form" onsubmit={(e) => { if (!confirm('Delete this customer and all related workloads?')) e.preventDefault(); }}>
		<button type="submit" class="btn-danger">
			Delete
		</button>
	</form>
</div>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.success}
	<p class="success">Customer updated successfully.</p>
{/if}

<div class="content-grid">
	<section class="edit-section">
		<h2>Edit Customer</h2>
		<CustomerForm customer={data.customer} action="?/save" />
	</section>

	<section class="related-section">
		<h2>Workloads ({data.workloads.length})</h2>
		{#if data.workloads.length === 0}
			<p class="empty-state">No workloads yet.</p>
		{:else}
			<ul class="workload-list">
				{#each data.workloads as workload}
					<li>
						<a href="/workloads/{workload.label}">{workload.name}</a>
						{#if workload.current_stage}
							<span class="stage-badge">{getStageInfo(workload.current_stage)?.label}</span>
						{/if}
						{#if workload.current_size}
							<span class="size">{formatCurrency(workload.current_size)}</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
		<a href="/workloads/new?customer={data.customer.customer}" class="btn-secondary">Add Workload</a>

		<h2>Events ({data.events.length})</h2>
		{#if data.events.length === 0}
			<p class="empty-state">No events yet.</p>
		{:else}
			<ul class="event-list">
				{#each data.events as event}
					<li>
						<div class="event-header">
							<span class="event-date">{formatDateTime(event.happened_at)}</span>
							{#if event.stage}
								<span class="stage-badge">{getStageInfo(event.stage)?.label}</span>
							{/if}
							{#if event.size}
								<span class="size">{formatCurrency(event.size)}</span>
							{/if}
						</div>
						<p class="event-outcome">{event.outcome}</p>
					</li>
				{/each}
			</ul>
		{/if}
		<a href="/events/new?customer={data.customer.customer}" class="btn-secondary">Add Event</a>
	</section>
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
	}

	h2 {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-size: 1.25rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 900px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.error {
		background-color: #fee;
		color: #c00;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success {
		background-color: #efe;
		color: #060;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.empty-state {
		color: #666;
		font-style: italic;
	}

	.delete-form {
		margin: 0;
	}

	.btn-danger {
		padding: 0.5rem 1rem;
		background-color: #cc0000;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-danger:hover {
		background-color: #aa0000;
	}

	.btn-secondary {
		display: inline-block;
		margin-top: 0.75rem;
		padding: 0.5rem 1rem;
		background-color: #f0f0f0;
		color: #333;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.btn-secondary:hover {
		background-color: #e0e0e0;
	}

	.workload-list,
	.event-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.workload-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}

	.workload-list a {
		color: #0066cc;
		text-decoration: none;
	}

	.workload-list a:hover {
		text-decoration: underline;
	}

	.event-list li {
		padding: 0.75rem 0;
		border-bottom: 1px solid #eee;
	}

	.event-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.event-date {
		font-size: 0.85rem;
		color: #666;
	}

	.event-outcome {
		margin: 0;
		font-size: 0.95rem;
	}

	.stage-badge {
		font-size: 0.75rem;
		padding: 0.15rem 0.4rem;
		background-color: #e0e0e0;
		border-radius: 3px;
	}

	.size {
		font-size: 0.85rem;
		color: #060;
		font-weight: 500;
	}
</style>
