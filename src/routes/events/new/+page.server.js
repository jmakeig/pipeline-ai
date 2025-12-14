import { redirect, fail } from '@sveltejs/kit';
import { create_event, get_customer_by_id, get_workload_by_id } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const customer_id = url.searchParams.get('customer');
	const workload_id = url.searchParams.get('workload');

	/** @type {import('$lib/types').EntitySearchResult | null} */
	let preselected_entity = null;

	if (workload_id) {
		const workload = await get_workload_by_id(workload_id);
		if (workload) {
			const customer = await get_customer_by_id(workload.customer);
			preselected_entity = {
				type: 'workload',
				id: workload.workload,
				label: workload.label,
				name: workload.name,
				subtitle: customer?.name || ''
			};
		}
	} else if (customer_id) {
		const customer = await get_customer_by_id(customer_id);
		if (customer) {
			preselected_entity = {
				type: 'customer',
				id: customer.customer,
				label: customer.label,
				name: customer.name,
				subtitle: `${customer.region} / ${customer.segment}`
			};
		}
	}

	return { preselected_entity };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const entity_type = form_data.get('entity_type')?.toString() || '';
		const entity_id = form_data.get('entity_id')?.toString() || '';
		const stage_str = form_data.get('stage')?.toString();
		const size_str = form_data.get('size')?.toString().trim();

		const data = {
			label: form_data.get('label')?.toString() || '',
			customer: entity_type === 'customer' ? entity_id : null,
			workload: entity_type === 'workload' ? entity_id : null,
			outcome: form_data.get('outcome')?.toString() || '',
			stage: stage_str ? parseInt(stage_str, 10) : null,
			size: size_str ? parseFloat(size_str) : null
		};

		const result = await create_event(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: { ...data, entity_type, entity_id }
			});
		}

		// Redirect back to the entity page
		if (entity_type === 'customer') {
			const customer = await get_customer_by_id(entity_id);
			throw redirect(303, `/customers/${customer?.label}`);
		} else {
			const workload = await get_workload_by_id(entity_id);
			throw redirect(303, `/workloads/${workload?.label}`);
		}
	}
};
