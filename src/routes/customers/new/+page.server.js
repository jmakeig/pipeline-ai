import { redirect, fail } from '@sveltejs/kit';
import { createCustomer } from '$lib/server/customers.js';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
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
			const customer = await createCustomer({
				label,
				name,
				region: /** @type {import('$lib/types').Region} */ (region),
				segment: /** @type {import('$lib/types').Segment} */ (segment),
				industry
			});
			throw redirect(303, `/customers/${customer.label}`);
		} catch (e) {
			if (e instanceof Response) throw e;
			const error = /** @type {Error} */ (e);
			if (error.message?.includes('unique constraint')) {
				return fail(400, { error: 'A customer with this label already exists' });
			}
			return fail(500, { error: 'Failed to create customer' });
		}
	}
};
