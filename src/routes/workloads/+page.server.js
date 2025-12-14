import { get_all_workloads } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const workloads = await get_all_workloads();
	return { workloads };
}
