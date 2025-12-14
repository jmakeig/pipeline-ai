import { error, redirect, fail } from '@sveltejs/kit';
import {
	getWorkloadByLabel,
	updateWorkload,
	deleteWorkload,
	getAllCustomers,
	getEventsByWorkload
} from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const workload = await getWorkloadByLabel(params.label);

	if (!workload) {
		throw error(404, 'Workload not found');
	}

	const [customers, events] = await Promise.all([
		getAllCustomers(),
		getEventsByWorkload(workload.workload)
	]);

	return { workload, customers, events };
}

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();

		const data = {
			label: formData.get('label')?.toString() || '',
			name: formData.get('name')?.toString() || '',
			customer: formData.get('customer')?.toString() || ''
		};

		const result = await updateWorkload(params.label, data);

		if (result.validation) {
			return fail(400, {
				validation: result.validation.toJSON(),
				values: data
			});
		}

		if (result.notFound) {
			return fail(404, { error: 'Workload not found' });
		}

		// Redirect to new label if changed
		if (data.label !== params.label) {
			throw redirect(303, `/workloads/${data.label}`);
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const deleted = await deleteWorkload(params.label);

		if (!deleted) {
			return fail(404, { error: 'Workload not found' });
		}

		throw redirect(303, '/workloads');
	}
};
