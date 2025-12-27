<script>
	import '../app.css';
	import QuickEventModal from '$lib/components/QuickEventModal.svelte';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();

	/** @type {QuickEventModal} */
	let quick_event_modal;
</script>

<div class="app">
	<nav>
		<a href="/" class="brand">Pipeline</a>
		<ul>
			<li><a href="/customers">Customers</a></li>
			<li><a href="/workloads">Workloads</a></li>
		</ul>
		<button class="quick-event-btn" onclick={() => quick_event_modal.open()}>
			+ Quick Event
		</button>
	</nav>

	<main>
		{@render children()}
	</main>
</div>

<QuickEventModal bind:this={quick_event_modal} />

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 0.75rem 1.5rem;
		background-color: #333;
	}

	.brand {
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
	}

	.brand:hover {
		color: #ccc;
	}

	ul {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
	}

	li a {
		color: #ccc;
		text-decoration: none;
	}

	li a:hover {
		color: white;
	}

	.quick-event-btn {
		padding: 0.4rem 0.75rem;
		background-color: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		white-space: nowrap;
	}

	.quick-event-btn:hover {
		background-color: #0055aa;
	}

	main {
		flex: 1;
		padding: 1.5rem;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}
</style>
