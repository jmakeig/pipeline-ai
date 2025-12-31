import { global_search } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const q = url.searchParams.get('q') || '';
	const type = url.searchParams.get('type') || null;

	if (!q) {
		return { q: '', type: null, results: [], facets: { customer: 0, workload: 0, event: 0 } };
	}

	const data = await global_search(q, type, 50);
	return { q, type, ...data };
}
