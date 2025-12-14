import { getCustomerCount, getWorkloadCount } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const [customerCount, workloadCount] = await Promise.all([
		getCustomerCount(),
		getWorkloadCount()
	]);

	return { customerCount, workloadCount };
}
