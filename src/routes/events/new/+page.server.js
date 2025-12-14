import { redirect, fail } from '@sveltejs/kit';
import { createEvent, getCustomerById, getWorkloadById } from '$lib/server/api.js';

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

		const entityType = formData.get('entityType')?.toString() || '';
		const entityId = formData.get('entityId')?.toString() || '';
		const stageStr = formData.get('stage')?.toString();
		const sizeStr = formData.get('size')?.toString().trim();

		const data = {
			label: formData.get('label')?.toString() || '',
			customer: entityType === 'customer' ? entityId : null,
			workload: entityType === 'workload' ? entityId : null,
			outcome: formData.get('outcome')?.toString() || '',
			stage: stageStr ? parseInt(stageStr, 10) : null,
			size: sizeStr ? parseFloat(sizeStr) : null
		};

		const result = await createEvent(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: { ...data, entityType, entityId }
			});
		}

		// Redirect back to the entity page
		if (entityType === 'customer') {
			const customer = await getCustomerById(entityId);
			throw redirect(303, `/customers/${customer?.label}`);
		} else {
			const workload = await getWorkloadById(entityId);
			throw redirect(303, `/workloads/${workload?.label}`);
		}
	}
};
