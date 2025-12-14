<script>
	import { get_stage_info, format_currency } from '$lib/constants.js';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>Workloads | Pipeline</title>
</svelte:head>

<div class="page-header">
	<h1>Workloads</h1>
	<a href="/workloads/new" class="btn-primary">New Workload</a>
</div>

{#if data.workloads.length === 0}
	<p class="empty-state">No workloads yet. <a href="/workloads/new">Create one</a>.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Customer</th>
				<th>Stage</th>
				<th>Size</th>
			</tr>
		</thead>
		<tbody>
			{#each data.workloads as workload}
				<tr>
					<td><a href="/workloads/{workload.label}">{workload.name}</a></td>
					<td>{workload.customer_name}</td>
					<td>
						{#if workload.current_stage}
							{get_stage_info(workload.current_stage)?.label}
						{:else}
							<span class="no-data">-</span>
						{/if}
					</td>
					<td>
						{#if workload.current_size}
							{format_currency(workload.current_size)}
						{:else}
							<span class="no-data">-</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
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

	table {
		width: 100%;
		border-collapse: collapse;
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

	td a {
		color: #0066cc;
		text-decoration: none;
	}

	td a:hover {
		text-decoration: underline;
	}

	.no-data {
		color: #999;
	}
</style>
