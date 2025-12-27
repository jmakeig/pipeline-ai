<script>
	import { REGIONS, SEGMENTS } from '$lib/constants.js';

	/** @type {{ customer?: import('$lib/types').Customer | null, action?: string }} */
	let { customer = null, action = '' } = $props();
</script>

<form method="POST" {action}>
	<div class="form-group">
		<label for="label">Label (URL-friendly identifier)</label>
		<input
			type="text"
			id="label"
			name="label"
			value={customer?.label ?? ''}
			pattern="[a-z0-9-]+"
			title="Lowercase letters, numbers, and hyphens only"
			placeholder={customer ? '' : 'Leave blank to auto-generate from name'}
		/>
	</div>

	<div class="form-group">
		<label for="name">Name</label>
		<input type="text" id="name" name="name" value={customer?.name ?? ''} required />
	</div>

	<div class="form-group">
		<label for="region">Region</label>
		<select id="region" name="region">
			<option value="">-- Select region --</option>
			{#each REGIONS as r}
				<option value={r} selected={r === customer?.region}>{r}</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="segment">Segment</label>
		<select id="segment" name="segment">
			<option value="">-- Select segment --</option>
			{#each SEGMENTS as s}
				<option value={s} selected={s === customer?.segment}>{s}</option>
			{/each}
		</select>
	</div>

	<div class="form-group">
		<label for="industry">Industry</label>
		<input type="text" id="industry" name="industry" value={customer?.industry ?? ''} />
	</div>

	<div class="form-actions">
		<button type="submit">{customer ? 'Update' : 'Create'} Customer</button>
		<a href="/customers" class="btn-cancel">Cancel</a>
	</div>
</form>

<style>
	form {
		max-width: 500px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}

	input,
	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	button:hover {
		background-color: #0055aa;
	}

	.btn-cancel {
		padding: 0.5rem 1rem;
		background-color: #f0f0f0;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		text-decoration: none;
		font-size: 1rem;
	}

	.btn-cancel:hover {
		background-color: #e0e0e0;
	}
</style>
