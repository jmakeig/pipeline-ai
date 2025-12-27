<script>
	import { STAGES } from "$lib/constants.js";
	import EntitySearch from "./EntitySearch.svelte";

	/** @type {{ event?: import('$lib/types').Event | null, preselected_entity?: import('$lib/types').EntitySearchResult | null, action?: string }} */
	let { event = null, preselected_entity = null, action = "" } = $props();

	/** @type {import('$lib/types').EntitySearchResult | null} */
	let selected_entity = $derived(preselected_entity);
</script>

<form method="POST" {action}>
	<div class="form-group">
		<label for="entity">Customer or Workload</label>
		<EntitySearch bind:selected={selected_entity} />
		{#if !selected_entity}
			<p class="hint">
				Start typing to search for a customer or workload
			</p>
		{/if}
	</div>

	<div class="form-group">
		<label for="outcome">Outcome (required)</label>
		<textarea
			id="outcome"
			name="outcome"
			required
			rows="4"
			placeholder="Describe decisions made and blockers to next stage..."
			>{event?.outcome ?? ""}</textarea
		>
	</div>

	{#if selected_entity?.type === "workload"}
		<div class="form-row">
			<div class="form-group">
				<label for="stage">Stage (optional)</label>
				<select id="stage" name="stage">
					<option value="">-- Select stage --</option>
					{#each STAGES as stage}
						<option
							value={stage.value}
							selected={stage.value === event?.stage}
							>{stage.label}</option
						>
					{/each}
				</select>
			</div>

			<div class="form-group">
				<label for="size">Size in USD (optional)</label>
				<input
					type="number"
					id="size"
					name="size"
					value={event?.size ?? ""}
					min="0"
					step="1"
					placeholder="e.g., 100000"
				/>
			</div>
		</div>
	{/if}

	<div class="form-actions">
		<button type="submit" disabled={!selected_entity}
			>{event ? "Update" : "Create"} Event</button
		>
		<a href="/events" class="btn-cancel">Cancel</a>
	</div>
</form>

<style>
	form {
		max-width: 600px;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}

	input,
	textarea,
	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: #0066cc;
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
	}

	.hint {
		font-size: 0.85rem;
		color: #666;
		margin-top: 0.25rem;
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

	button:hover:not(:disabled) {
		background-color: #0055aa;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
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
