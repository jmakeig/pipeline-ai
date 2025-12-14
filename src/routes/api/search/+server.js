import { json } from '@sveltejs/kit';
import { searchEntities } from '$lib/server/api.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const query = url.searchParams.get('q') || '';

	if (query.length < 2) {
		return json([]);
	}

	const results = await searchEntities(query, 10);
	return json(results);
}
