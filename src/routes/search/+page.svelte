<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	/**
	 * Get the link URL for a search result
	 * @param {import('$lib/server/api.js').GlobalSearchResult} result
	 */
	function get_link(result) {
		if (result.type === 'customer' && result.label) {
			return `/customers/${result.label}`;
		}
		if (result.type === 'workload' && result.label) {
			return `/workloads/${result.label}`;
		}
		if (result.type === 'event' && result.label) {
			// Events link to their related customer or workload
			if (result.subtitle.startsWith('Customer:')) {
				return `/customers/${result.label}`;
			}
			if (result.subtitle.startsWith('Workload:')) {
				return `/workloads/${result.label}`;
			}
		}
		return null;
	}

	/**
	 * Get the display type label
	 * @param {import('$lib/server/api.js').GlobalSearchResult} result
	 */
	function get_type_label(result) {
		if (result.type === 'customer') return 'Customer';
		if (result.type === 'workload') return 'Workload';
		if (result.type === 'event') return 'Event';
		return result.type;
	}
</script>

<svelte:head>
	<title>Search{data.q ? `: ${data.q}` : ''} | Pipeline</title>
</svelte:head>

<h1>Search</h1>

<form method="GET" action="/search" class="search-form">
	<input
		type="search"
		name="q"
		placeholder="Search customers, workloads, events..."
		value={data.q}
		class="search-input"
	/>
	<button type="submit" class="search-btn">Search</button>
</form>

{#if data.q}
	{#if data.results.length === 0}
		<p class="no-results">No results found for "{data.q}"</p>
	{:else}
		<p class="results-count">Found {data.results.length} result{data.results.length === 1 ? '' : 's'}</p>

		<div class="results">
			{#each data.results as result}
				{@const link = get_link(result)}
				<div class="result-item">
					<span class="result-type">{get_type_label(result)}</span>
					<a href={link} class="result-name">{result.name}</a>
					{#if result.subtitle}
						<span class="result-subtitle">{result.subtitle}</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{/if}

<style>
	h1 {
		margin-bottom: 1.5rem;
	}

	.search-form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem;
		font-size: 1rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.search-input:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
	}

	.search-btn {
		padding: 0.75rem 1.5rem;
		background-color: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	.search-btn:hover {
		background-color: #0055aa;
	}

	.results-count {
		color: #666;
		margin-bottom: 1rem;
	}

	.no-results {
		color: #666;
		font-style: italic;
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.result-item:hover {
		background-color: #f5f5f5;
	}

	.result-type {
		padding: 0.25rem 0.5rem;
		background-color: #e5e5e5;
		color: #666;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: 3px;
		min-width: 80px;
		text-align: center;
	}

	.result-name {
		font-weight: 500;
		color: #0066cc;
		text-decoration: none;
	}

	.result-name:hover {
		text-decoration: underline;
	}

	.result-subtitle {
		color: #666;
		font-size: 0.9rem;
	}
</style>
