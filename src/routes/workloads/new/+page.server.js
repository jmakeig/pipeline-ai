import { redirect, fail } from '@sveltejs/kit';
import { createWorkload, getAllCustomers } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const customers = await getAllCustomers();
	const preselectedCustomer = url.searchParams.get('customer') || '';
	return { customers, preselectedCustomer };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const data = {
			label: formData.get('label')?.toString() || '',
			name: formData.get('name')?.toString() || '',
			customer: formData.get('customer')?.toString() || ''
		};

		const result = await createWorkload(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		throw redirect(303, `/workloads/${result.workload?.label}`);
	}
};
