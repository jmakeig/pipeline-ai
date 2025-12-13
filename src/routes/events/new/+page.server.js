import { redirect, fail } from '@sveltejs/kit';
import { createEvent } from '$lib/server/events.js';
import { getCustomerById } from '$lib/server/customers.js';
import { getWorkloadById } from '$lib/server/workloads.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const customerId = url.searchParams.get('customer');
	const workloadId = url.searchParams.get('workload');

	/** @type {import('$lib/types').EntitySearchResult | null} */
	let preselectedEntity = null;

	if (workloadId) {
		const workload = await getWorkloadById(workloadId);
		if (workload) {
			const customer = await getCustomerById(workload.customer);
			preselectedEntity = {
				type: 'workload',
				id: workload.workload,
				label: workload.label,
				name: workload.name,
				subtitle: customer?.name || ''
			};
		}
	} else if (customerId) {
		const customer = await getCustomerById(customerId);
		if (customer) {
			preselectedEntity = {
				type: 'customer',
				id: customer.customer,
				label: customer.label,
				name: customer.name,
				subtitle: `${customer.region} / ${customer.segment}`
			};
		}
	}

	return { preselectedEntity };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const label = formData.get('label')?.toString().trim();
		const entityType = formData.get('entityType')?.toString();
		const entityId = formData.get('entityId')?.toString();
		const outcome = formData.get('outcome')?.toString().trim();
		const stageStr = formData.get('stage')?.toString();
		const sizeStr = formData.get('size')?.toString().trim();

		if (!label || !entityType || !entityId || !outcome) {
			return fail(400, { error: 'Label, entity, and outcome are required' });
		}

		const stage = stageStr ? parseInt(stageStr, 10) : null;
		const size = sizeStr ? parseFloat(sizeStr) : null;

		try {
			const event = await createEvent({
				label,
				customer: entityType === 'customer' ? entityId : null,
				workload: entityType === 'workload' ? entityId : null,
				outcome,
				stage: /** @type {import('$lib/types').Stage | null} */ (stage),
				size
			});

			// Redirect back to the entity page
			if (entityType === 'customer') {
				const customer = await getCustomerById(entityId);
				throw redirect(303, `/customers/${customer?.label}`);
			} else {
				const workload = await getWorkloadById(entityId);
				throw redirect(303, `/workloads/${workload?.label}`);
			}
		} catch (e) {
			if (e instanceof Response) throw e;
			const error = /** @type {Error} */ (e);
			if (error.message?.includes('unique constraint')) {
				return fail(400, { error: 'An event with this label already exists' });
			}
			console.error('Failed to create event:', error);
			return fail(500, { error: 'Failed to create event' });
		}
	}
};
