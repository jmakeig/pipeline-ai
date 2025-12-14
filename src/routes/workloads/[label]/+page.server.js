import { error, redirect, fail } from '@sveltejs/kit';
import {
	get_workload_by_label,
	update_workload,
	delete_workload,
	get_all_customers,
	get_events_by_workload
} from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const workload = await get_workload_by_label(params.label);

	if (!workload) {
		throw error(404, 'Workload not found');
	}

	const [customers, events] = await Promise.all([
		get_all_customers(),
		get_events_by_workload(workload.workload)
	]);

	return { workload, customers, events };
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, params }) => {
		const form_data = await request.formData();

		const data = {
			label: form_data.get('label')?.toString() || '',
			name: form_data.get('name')?.toString() || '',
			customer: form_data.get('customer')?.toString() || ''
		};

		const result = await update_workload(params.label, data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		if (result.not_found) {
			return fail(404, { error: 'Workload not found' });
		}

		// Redirect to new label if changed
		if (data.label !== params.label) {
			throw redirect(303, `/workloads/${data.label}`);
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const deleted = await delete_workload(params.label);

		if (!deleted) {
			return fail(404, { error: 'Workload not found' });
		}

		throw redirect(303, '/workloads');
	}
};
