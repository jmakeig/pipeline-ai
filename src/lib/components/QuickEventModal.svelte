<script>
	import { STAGES } from '$lib/constants.js';
	import EntitySearch from './EntitySearch.svelte';

	/** @type {{ onclose?: () => void }} */
	let { onclose } = $props();

	/** @type {HTMLDialogElement} */
	let dialog;

	/** @type {import('$lib/types').EntitySearchResult | null} */
	let selected_entity = $state(/** @type {import('$lib/types').EntitySearchResult | null} */ (null));

	let outcome = $state('');
	let stage = $state('');
	let size = $state('');

	// New workload creation state
	let is_creating_workload = $state(false);
	let new_workload_name = $state('');
	/** @type {import('$lib/types').EntitySearchResult | null} */
	let selected_customer = $state(/** @type {import('$lib/types').EntitySearchResult | null} */ (null));
	let last_search_query = $state('');

	let is_submitting = $state(false);
	let error_message = $state('');
	let success_message = $state('');

	export function open() {
		reset_form();
		dialog.showModal();
	}

	export function close() {
		dialog.close();
		onclose?.();
	}

	function reset_form() {
		selected_entity = null;
		outcome = '';
		stage = '';
		size = '';
		is_creating_workload = false;
		new_workload_name = '';
		selected_customer = null;
		last_search_query = '';
		error_message = '';
		success_message = '';
	}

	/**
	 * @param {string} query
	 */
	function handle_no_search_results(query) {
		last_search_query = query;
	}

	function start_create_workload() {
		is_creating_workload = true;
		new_workload_name = last_search_query;
		selected_entity = null;
	}

	function cancel_create_workload() {
		is_creating_workload = false;
		new_workload_name = '';
		selected_customer = null;
	}

	/**
	 * @param {Event} e
	 */
	async function handle_submit(e) {
		e.preventDefault();
		error_message = '';
		success_message = '';
		is_submitting = true;

		try {
			/** @type {Record<string, any>} */
			const payload = {
				outcome,
				stage: stage || null,
				size: size || null
			};

			if (is_creating_workload) {
				payload.create_workload = true;
				payload.new_workload_name = new_workload_name;
				payload.customer_id = selected_customer?.id;
			} else {
				payload.entity_type = selected_entity?.type;
				payload.entity_id = selected_entity?.id;
			}

			const response = await fetch('/api/quick-event', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok) {
				error_message = result.error || 'Failed to create event';
				return;
			}

			success_message = is_creating_workload
				? 'Workload and event created successfully!'
				: 'Event created successfully!';
			setTimeout(() => {
				close();
				window.location.reload();
			}, 1000);
		} catch (e) {
			error_message = 'An unexpected error occurred';
			console.error(e);
		} finally {
			is_submitting = false;
		}
	}

	function handle_backdrop_click(/** @type {MouseEvent} */ e) {
		if (e.target === dialog) {
			close();
		}
	}

	$effect(() => {
		if (selected_entity?.type === 'customer') {
			stage = '';
			size = '';
		}
	});

	let can_submit = $derived(
		outcome.trim() !== '' && (
			selected_entity !== null ||
			(is_creating_workload && new_workload_name.trim() !== '' && selected_customer !== null)
		)
	);

	let show_workload_fields = $derived(
		selected_entity?.type === 'workload' || is_creating_workload
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclick={handle_backdrop_click} onkeydown={(e) => e.key === 'Escape' && close()}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-content" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
		<header>
			<h2>Quick Event</h2>
			<button type="button" class="close-btn" onclick={close}>&times;</button>
		</header>

		{#if error_message}
			<div class="error">{error_message}</div>
		{/if}

		{#if success_message}
			<div class="success">{success_message}</div>
		{/if}

		<form onsubmit={handle_submit}>
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<div class="form-group">
				<label>Customer or Workload</label>

				{#if is_creating_workload}
					<div class="new-workload-form">
						<div class="new-workload-header">
							<span class="badge workload">New Workload</span>
							<button type="button" class="link-btn" onclick={cancel_create_workload}>Cancel</button>
						</div>
						<input
							type="text"
							bind:value={new_workload_name}
							placeholder="Workload name"
						/>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<div class="customer-select">
							<label>Customer</label>
							<EntitySearch
								bind:selected={selected_customer}
								type_filter="customer"
								placeholder="Search for a customer..."
							/>
						</div>
					</div>
				{:else}
					<EntitySearch
						bind:selected={selected_entity}
						onnosearchresults={handle_no_search_results}
					/>
					{#if !selected_entity}
						<p class="hint">
							Start typing to search for a customer or workload
							{#if last_search_query}
								<br/>
								<button type="button" class="link-btn create-new-btn" onclick={start_create_workload}>
									+ Create new workload "{last_search_query}"
								</button>
							{/if}
						</p>
					{/if}
				{/if}
			</div>

			<div class="form-group">
				<label for="outcome">Outcome (required)</label>
				<textarea
					id="outcome"
					bind:value={outcome}
					required
					rows="3"
					placeholder="Describe decisions made and blockers to next stage..."
				></textarea>
			</div>

			{#if show_workload_fields}
				<div class="form-row">
					<div class="form-group">
						<label for="stage">Stage (optional)</label>
						<select id="stage" bind:value={stage}>
							<option value="">-- Select stage --</option>
							{#each STAGES as s}
								<option value={s.value}>{s.label}</option>
							{/each}
						</select>
					</div>
					<div class="form-group">
						<label for="size">Size in USD (optional)</label>
						<input
							type="number"
							id="size"
							bind:value={size}
							min="0"
							step="1"
							placeholder="e.g., 100000"
						/>
					</div>
				</div>
			{/if}

			<div class="form-actions">
				<button type="submit" disabled={!can_submit || is_submitting}>
					{is_submitting ? 'Creating...' : 'Create Event'}
				</button>
				<button type="button" class="btn-cancel" onclick={close}>Cancel</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	dialog {
		border: none;
		border-radius: 8px;
		padding: 0;
		max-width: 500px;
		width: 90vw;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-content {
		padding: 1.5rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		padding: 0;
		line-height: 1;
	}

	.close-btn:hover {
		color: #333;
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
		box-sizing: border-box;
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

	.link-btn {
		background: none;
		border: none;
		color: #0066cc;
		cursor: pointer;
		font-size: inherit;
		padding: 0;
	}

	.link-btn:hover {
		text-decoration: underline;
	}

	.create-new-btn {
		margin-top: 0.25rem;
	}

	.new-workload-form {
		background-color: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.new-workload-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-weight: 500;
		color: white;
	}

	.badge.workload {
		background-color: #009933;
	}

	.customer-select {
		margin-top: 0.25rem;
	}

	.customer-select label {
		font-size: 0.85rem;
		margin-bottom: 0.25rem;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	button[type='submit'] {
		padding: 0.5rem 1rem;
		background-color: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	button[type='submit']:hover:not(:disabled) {
		background-color: #0055aa;
	}

	button[type='submit']:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.btn-cancel {
		padding: 0.5rem 1rem;
		background-color: #f0f0f0;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	.btn-cancel:hover {
		background-color: #e0e0e0;
	}

	.error {
		background-color: #fee;
		color: #c00;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.success {
		background-color: #efe;
		color: #060;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
</style>
