import { redirect, fail } from '@sveltejs/kit';
import { createCustomer } from '$lib/server/api.js';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const data = {
			label: formData.get('label')?.toString() || '',
			name: formData.get('name')?.toString() || '',
			region: formData.get('region')?.toString() || '',
			segment: formData.get('segment')?.toString() || '',
			industry: formData.get('industry')?.toString() || ''
		};

		const result = await createCustomer(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		throw redirect(303, `/customers/${result.customer?.label}`);
	}
};
