import { query } from '$lib/server/db.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const [customerResult, workloadResult] = await Promise.all([
		query('SELECT COUNT(*) as count FROM customers'),
		query('SELECT COUNT(*) as count FROM workloads')
	]);

	return {
		customerCount: parseInt(customerResult.rows[0].count, 10),
		workloadCount: parseInt(workloadResult.rows[0].count, 10)
	};
}
