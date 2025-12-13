import { error, redirect, fail } from '@sveltejs/kit';
import { getWorkloadByLabel, updateWorkload, deleteWorkload } from '$lib/server/workloads.js';
import { getAllCustomers } from '$lib/server/customers.js';
import { getEventsByWorkload } from '$lib/server/events.js';

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

		const label = formData.get('label')?.toString().trim();
		const name = formData.get('name')?.toString().trim();
		const customer = formData.get('customer')?.toString();

		if (!label || !name || !customer) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const workload = await updateWorkload(params.label, { label, name, customer });

			if (!workload) {
				return fail(404, { error: 'Workload not found' });
			}

			// Redirect to new label if changed
			if (label !== params.label) {
				throw redirect(303, `/workloads/${label}`);
			}

			return { success: true };
		} catch (e) {
			if (e instanceof Response) throw e;
			const err = /** @type {Error} */ (e);
			if (err.message?.includes('unique constraint')) {
				return fail(400, { error: 'A workload with this label already exists' });
			}
			return fail(500, { error: 'Failed to update workload' });
		}
	},

	delete: async ({ params }) => {
		const deleted = await deleteWorkload(params.label);

		if (!deleted) {
			return fail(404, { error: 'Workload not found' });
		}

		throw redirect(303, '/workloads');
	}
};
