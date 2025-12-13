import { getAllCustomers } from '$lib/server/customers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const customers = await getAllCustomers();
	return { customers };
}
