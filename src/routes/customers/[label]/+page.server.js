import { error, redirect, fail } from '@sveltejs/kit';
import {
	getCustomerByLabel,
	updateCustomer,
	deleteCustomer,
	getWorkloadsByCustomer,
	getEventsByCustomer
} from '$lib/server/api.js';

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

		const data = {
			label: formData.get('label')?.toString() || '',
			name: formData.get('name')?.toString() || '',
			region: formData.get('region')?.toString() || '',
			segment: formData.get('segment')?.toString() || '',
			industry: formData.get('industry')?.toString() || ''
		};

		const result = await updateCustomer(params.label, data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		if (result.notFound) {
			return fail(404, { error: 'Customer not found' });
		}

		// Redirect to new label if changed
		if (data.label !== params.label) {
			throw redirect(303, `/customers/${data.label}`);
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const deleted = await deleteCustomer(params.label);

		if (!deleted) {
			return fail(404, { error: 'Customer not found' });
		}

		throw redirect(303, '/customers');
	}
};
