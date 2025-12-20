<script>
	/** @type {{ selected: import('$lib/types').EntitySearchResult | null, placeholder?: string }} */
	let { selected = $bindable(null), placeholder = 'Search customers or workloads...' } = $props();

	/** @type {import('$lib/types').EntitySearchResult[]} */
	let results = $state([]);
	let query = $state(selected?.name ?? '');
	let is_open = $state(false);
	let is_loading = $state(false);
	let highlighted_index = $state(-1);

	/** @type {ReturnType<typeof setTimeout> | null} */
	let debounce_timer = null;

	async function search() {
		if (query.length < 2) {
			results = [];
			return;
		}

		is_loading = true;
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				results = await response.json();
			}
		} catch (e) {
			console.error('Search error:', e);
			results = [];
		} finally {
			is_loading = false;
		}
	}

	function handle_input() {
		if (debounce_timer) clearTimeout(debounce_timer);
		debounce_timer = setTimeout(search, 200);
		is_open = true;
		highlighted_index = -1;
	}

	/**
	 * @param {import('$lib/types').EntitySearchResult} result
	 */
	function select_result(result) {
		selected = result;
		query = result.name;
		is_open = false;
		results = [];
	}

	function clear_selection() {
		selected = null;
		query = '';
		results = [];
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	function handle_keydown(e) {
		if (!is_open || results.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlighted_index = Math.min(highlighted_index + 1, results.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlighted_index = Math.max(highlighted_index - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (highlighted_index >= 0) {
					select_result(results[highlighted_index]);
				}
				break;
			case 'Escape':
				is_open = false;
				break;
		}
	}
</script>

<div class="entity-search">
	<div class="input-wrapper">
		<input
			type="text"
			bind:value={query}
			oninput={handle_input}
			onkeydown={handle_keydown}
			onfocus={() => (is_open = true)}
			onblur={() => setTimeout(() => (is_open = false), 200)}
			{placeholder}
			autocomplete="off"
		/>
		{#if selected}
			<button type="button" class="clear-btn" onclick={clear_selection}>&times;</button>
		{/if}
		{#if is_loading}
			<span class="loading">...</span>
		{/if}
	</div>

	{#if is_open && results.length > 0}
		<ul class="results">
			{#each results as result, i}
				<li role="row"
					class:highlighted={i === highlighted_index}
					onmousedown={() => select_result(result)}
				>
					<span class="type-badge" class:customer={result.type === 'customer'} class:workload={result.type === 'workload'}>
						{result.type === 'customer' ? 'C' : 'W'}
					</span>
					<div class="result-info">
						<span class="result-name">{result.name}</span>
						<span class="result-subtitle">{result.subtitle}</span>
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	{#if selected}
		<input type="hidden" name="entity_type" value={selected.type} />
		<input type="hidden" name="entity_id" value={selected.id} />
	{/if}
</div>

<style>
	.entity-search {
		position: relative;
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	input[type='text'] {
		width: 100%;
		padding: 0.5rem;
		padding-right: 2rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	input[type='text']:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
	}

	.clear-btn {
		position: absolute;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.25rem;
		color: #666;
		cursor: pointer;
		padding: 0 0.25rem;
	}

	.clear-btn:hover {
		color: #333;
	}

	.loading {
		position: absolute;
		right: 0.5rem;
		color: #666;
	}

	.results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 2px;
		max-height: 300px;
		overflow-y: auto;
		list-style: none;
		padding: 0;
		z-index: 100;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.results li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		cursor: pointer;
	}

	.results li:hover,
	.results li.highlighted {
		background-color: #f0f0f0;
	}

	.type-badge {
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: bold;
		color: white;
	}

	.type-badge.customer {
		background-color: #0066cc;
	}

	.type-badge.workload {
		background-color: #009933;
	}

	.result-info {
		display: flex;
		flex-direction: column;
	}

	.result-name {
		font-weight: 500;
	}

	.result-subtitle {
		font-size: 0.85rem;
		color: #666;
	}
</style>
