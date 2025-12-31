import { get_events_paginated } from '$lib/server/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const data = await get_events_paginated(page, 50);
	return data;
}
