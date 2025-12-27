import { json } from '@sveltejs/kit';
import { create_event, create_workload_and_event } from '$lib/server/api.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const body = await request.json();
		const { entity_type, entity_id, outcome, stage, size, create_workload, new_workload_name, customer_id } = body;

		if (!outcome?.trim()) {
			return json({ error: 'Outcome is required' }, { status: 400 });
		}

		// Handle creating a new workload with event
		if (create_workload) {
			if (!new_workload_name?.trim()) {
				return json({ error: 'Workload name is required' }, { status: 400 });
			}
			if (!customer_id) {
				return json({ error: 'Customer is required when creating a new workload' }, { status: 400 });
			}

			const result = await create_workload_and_event({
				name: new_workload_name.trim(),
				customer: customer_id,
				outcome: outcome.trim(),
				stage: stage ? parseInt(stage, 10) : null,
				size: size ? parseFloat(size) : null
			});

			if (result.validation) {
				const errors = result.validation.toJSON();
				return json({ error: errors[0]?.message || 'Validation failed' }, { status: 400 });
			}

			return json({ success: true, workload: result.workload, event: result.event });
		}

		// Handle creating event for existing entity
		if (!entity_type || !entity_id) {
			return json({ error: 'Customer or workload is required' }, { status: 400 });
		}

		const data = {
			customer: entity_type === 'customer' ? entity_id : null,
			workload: entity_type === 'workload' ? entity_id : null,
			outcome: outcome.trim(),
			stage: stage ? parseInt(stage, 10) : null,
			size: size ? parseFloat(size) : null
		};

		const result = await create_event(data);

		if (result.validation) {
			const errors = result.validation.toJSON();
			return json({ error: errors[0]?.message || 'Validation failed' }, { status: 400 });
		}

		return json({ success: true, event: result.event });
	} catch (e) {
		console.error('Quick event creation failed:', e);
		return json({ error: 'Failed to create event' }, { status: 500 });
	}
}
