import { redirect, fail } from '@sveltejs/kit';
import { create_workload, get_all_customers } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const customers = await get_all_customers();
	const preselected_customer = url.searchParams.get('customer') || '';
	return { customers, preselected_customer };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const data = {
			label: form_data.get('label')?.toString() || '',
			name: form_data.get('name')?.toString() || '',
			customer: form_data.get('customer')?.toString() || ''
		};

		const result = await create_workload(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		throw redirect(303, `/workloads/${result.workload?.label}`);
	}
};
