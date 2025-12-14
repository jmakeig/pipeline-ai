import { error, redirect, fail } from '@sveltejs/kit';
import {
	get_customer_by_label,
	update_customer,
	delete_customer,
	get_workloads_by_customer,
	get_events_by_customer
} from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const customer = await get_customer_by_label(params.label);

	if (!customer) {
		throw error(404, 'Customer not found');
	}

	const [workloads, events] = await Promise.all([
		get_workloads_by_customer(customer.customer),
		get_events_by_customer(customer.customer)
	]);

	return { customer, workloads, events };
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, params }) => {
		const form_data = await request.formData();

		const data = {
			label: form_data.get('label')?.toString() || '',
			name: form_data.get('name')?.toString() || '',
			region: form_data.get('region')?.toString() || '',
			segment: form_data.get('segment')?.toString() || '',
			industry: form_data.get('industry')?.toString() || ''
		};

		const result = await update_customer(params.label, data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		if (result.not_found) {
			return fail(404, { error: 'Customer not found' });
		}

		// Redirect to new label if changed
		if (data.label !== params.label) {
			throw redirect(303, `/customers/${data.label}`);
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const deleted = await delete_customer(params.label);

		if (!deleted) {
			return fail(404, { error: 'Customer not found' });
		}

		throw redirect(303, '/customers');
	}
};
