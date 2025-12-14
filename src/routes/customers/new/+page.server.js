import { redirect, fail } from '@sveltejs/kit';
import { create_customer } from '$lib/server/api.js';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData();

		const data = {
			label: form_data.get('label')?.toString() || '',
			name: form_data.get('name')?.toString() || '',
			region: form_data.get('region')?.toString() || '',
			segment: form_data.get('segment')?.toString() || '',
			industry: form_data.get('industry')?.toString() || ''
		};

		const result = await create_customer(data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		throw redirect(303, `/customers/${result.customer?.label}`);
	}
};
