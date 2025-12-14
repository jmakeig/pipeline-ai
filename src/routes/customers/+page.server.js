import { get_all_customers } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customers = await get_all_customers();
	return { customers };
}
