<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>Customers | Pipeline</title>
</svelte:head>

<div class="page-header">
	<h1>Customers</h1>
	<a href="/customers/new" class="btn-primary">New Customer</a>
</div>

{#if data.customers.length === 0}
	<p class="empty-state">No customers yet. <a href="/customers/new">Create one</a>.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Region</th>
				<th>Segment</th>
				<th>Industry</th>
			</tr>
		</thead>
		<tbody>
			{#each data.customers as customer}
				<tr>
					<td><a href="/customers/{customer.label}">{customer.name}</a></td>
					<td>{customer.region}</td>
					<td>{customer.segment}</td>
					<td>{customer.industry}</td>
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
</style>
