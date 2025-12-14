import { get_customer_count, get_workload_count } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const [customer_count, workload_count] = await Promise.all([
		get_customer_count(),
		get_workload_count()
	]);

	return { customer_count, workload_count };
}
