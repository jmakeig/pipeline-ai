import { getAllWorkloads } from '$lib/server/workloads.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const workloads = await getAllWorkloads();
	return { workloads };
}
