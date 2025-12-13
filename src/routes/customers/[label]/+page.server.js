import { error, redirect, fail } from '@sveltejs/kit';
import { getCustomerByLabel, updateCustomer, deleteCustomer } from '$lib/server/customers.js';
import { getWorkloadsByCustomer } from '$lib/server/workloads.js';
import { getEventsByCustomer } from '$lib/server/events.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customer = await getCustomerByLabel(params.label);

	if (!customer) {
		throw error(404, 'Customer not found');
	}

	const [workloads, events] = await Promise.all([
		getWorkloadsByCustomer(customer.customer),
		getEventsByCustomer(customer.customer)
	]);

	return { customer, workloads, events };
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();

		const label = formData.get('label')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const region = formData.get('region')?.toString();
		const segment = formData.get('segment')?.toString();
		const industry = formData.get('industry')?.toString().trim();

		if (!label || !name || !region || !segment || !industry) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const customer = await updateCustomer(params.label, {
				label,
				name,
				region: /** @type {import('$lib/types').Region} */ (region),
				segment: /** @type {import('$lib/types').Segment} */ (segment),
				industry
			});

			if (!customer) {
				return fail(404, { error: 'Customer not found' });
			}

			// Redirect to new label if changed
			if (label !== params.label) {
				throw redirect(303, `/customers/${label}`);
			}

			return { success: true };
		} catch (e) {
			if (e instanceof Response) throw e;
			const err = /** @type {Error} */ (e);
			if (err.message?.includes('unique constraint')) {
				return fail(400, { error: 'A customer with this label already exists' });
			}
			return fail(500, { error: 'Failed to update customer' });
		}
	},

	delete: async ({ params }) => {
		const deleted = await deleteCustomer(params.label);

		if (!deleted) {
			return fail(404, { error: 'Customer not found' });
		}

		throw redirect(303, '/customers');
	}
};
