<script>
	import '../app.css';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();
</script>

<div class="app">
	<nav>
		<a href="/" class="brand">Pipeline</a>
		<ul>
			<li><a href="/customers">Customers</a></li>
			<li><a href="/workloads">Workloads</a></li>
			<li><a href="/events/new">New Event</a></li>
		</ul>
	</nav>

	<main>
		{@render children()}
	</main>
</div>

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
	}

	li a {
		color: #ccc;
		text-decoration: none;
	}

	li a:hover {
		color: white;
	}

	main {
		flex: 1;
		padding: 1.5rem;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}
</style>
