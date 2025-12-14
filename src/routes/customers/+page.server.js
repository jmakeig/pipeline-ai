import { getAllCustomers } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customers = await getAllCustomers();
	return { customers };
}
