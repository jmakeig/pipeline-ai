<script>
	import { format_date_time, format_currency, get_stage_info } from '$lib/constants.js';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	/**
	 * Get the entity link for an event
	 * @param {import('$lib/types').EventWithNames} event
	 */
	function get_entity_link(event) {
		if (event.customer) {
			return { type: 'Customer', name: event.customer_name || 'Unknown', href: null };
		}
		if (event.workload) {
			return { type: 'Workload', name: event.workload_name || 'Unknown', href: null };
		}
		return { type: '', name: '', href: null };
	}
</script>

<svelte:head>
	<title>Events | Pipeline</title>
</svelte:head>

<div class="page-header">
	<h1>Events</h1>
	<a href="/events/new" class="btn-primary">New Event</a>
</div>

{#if data.events.length === 0}
	<p class="empty-state">No events yet. <a href="/events/new">Create one</a>.</p>
{:else}
	<div class="pagination-info">
		Showing {(data.page - 1) * data.page_size + 1}-{Math.min(data.page * data.page_size, data.total)} of {data.total} events
	</div>

	<table>
		<thead>
			<tr>
				<th>When</th>
				<th>Entity Type</th>
				<th>Entity</th>
				<th>Outcome</th>
				<th>Stage</th>
				<th>Size</th>
			</tr>
		</thead>
		<tbody>
			{#each data.events as event}
				{@const entity = get_entity_link(event)}
				{@const stage_info = get_stage_info(event.stage)}
				<tr>
					<td class="date-cell">{format_date_time(event.happened_at)}</td>
					<td>{entity.type}</td>
					<td>{entity.name}</td>
					<td class="outcome-cell">{event.outcome}</td>
					<td>{stage_info ? stage_info.label : '-'}</td>
					<td class="size-cell">{format_currency(event.size)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if data.total_pages > 1}
		<div class="pagination">
			{#if data.page > 1}
				<a href="/events?page=1" class="pagination-btn">First</a>
				<a href="/events?page={data.page - 1}" class="pagination-btn">Previous</a>
			{/if}

			<span class="pagination-info-inline">
				Page {data.page} of {data.total_pages}
			</span>

			{#if data.page < data.total_pages}
				<a href="/events?page={data.page + 1}" class="pagination-btn">Next</a>
				<a href="/events?page={data.total_pages}" class="pagination-btn">Last</a>
			{/if}
		</div>
	{/if}
{/if}

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

	.btn-primary {
		padding: 0.5rem 1rem;
		background-color: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
	}

	.btn-primary:hover {
		background-color: #0055aa;
	}

	.empty-state {
		color: #666;
		font-style: italic;
	}

	.pagination-info {
		margin-bottom: 1rem;
		color: #666;
		font-size: 0.9rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #ddd;
	}

	th {
		background-color: #f5f5f5;
		font-weight: 600;
	}

	tbody tr:hover {
		background-color: #f9f9f9;
	}

	.date-cell {
		white-space: nowrap;
		color: #666;
		font-size: 0.9rem;
	}

	.outcome-cell {
		max-width: 400px;
	}

	.size-cell {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		background-color: #f5f5f5;
		color: #333;
		text-decoration: none;
		border-radius: 4px;
		border: 1px solid #ddd;
	}

	.pagination-btn:hover {
		background-color: #e5e5e5;
	}

	.pagination-info-inline {
		padding: 0 1rem;
		color: #666;
		font-size: 0.9rem;
	}
</style>
