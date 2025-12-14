<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<svelte:head>
	<title>Pipeline | Sales Opportunity Tracker</title>
</svelte:head>

<h1>Sales Pipeline</h1>

<p>Track opportunities through your sales pipeline.</p>

<div class="quick-actions">
	<a href="/customers" class="card">
		<h2>Customers</h2>
		<p>{data.customer_count} total</p>
	</a>
	<a href="/workloads" class="card">
		<h2>Workloads</h2>
		<p>{data.workload_count} total</p>
	</a>
	<a href="/events/new" class="card">
		<h2>New Event</h2>
		<p>Log an interaction</p>
	</a>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: #666;
		margin-bottom: 2rem;
	}

	.quick-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.card {
		display: block;
		padding: 1.5rem;
		background-color: #f5f5f5;
		border-radius: 8px;
		text-decoration: none;
		transition: background-color 0.15s;
	}

	.card:hover {
		background-color: #e8e8e8;
	}

	.card h2 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.25rem;
	}

	.card p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}
</style>
