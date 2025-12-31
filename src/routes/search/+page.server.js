import { global_search } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const q = url.searchParams.get('q') || '';
	const results = q ? await global_search(q, 50) : [];
	return { q, results };
}
