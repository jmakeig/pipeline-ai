import { redirect, fail } from '@sveltejs/kit';
import { createWorkload } from '$lib/server/workloads.js';
import { getAllCustomers } from '$lib/server/customers.js';

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

		const label = formData.get('label')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const customer = formData.get('customer')?.toString();

		if (!label || !name || !customer) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const workload = await createWorkload({ label, name, customer });
			throw redirect(303, `/workloads/${workload.label}`);
		} catch (e) {
			if (e instanceof Response) throw e;
			const error = /** @type {Error} */ (e);
			if (error.message?.includes('unique constraint')) {
				return fail(400, { error: 'A workload with this label already exists' });
			}
			return fail(500, { error: 'Failed to create workload' });
		}
	}
};
