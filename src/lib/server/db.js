import pg from 'pg';
import { env } from '$env/dynamic/private';

/** @type {any} */
const pool = new pg.Pool({
	connectionString: env.DATABASE_URL
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query
 * @param {any[]} [params] - Query parameters
 * @returns {Promise<{rows: any[], rowCount: number}>}
 */
export function query(text, params) {
	return pool.query(text, params);
}

/**
 * @typedef {object} Client
 * @property {(text: string, params?: any[]) => Promise<{rows: any[], rowCount: number}>} query
 */

/**
 * Execute a function within a database transaction
 * @template T
 * @param {(client: Client) => Promise<T>} fn - Function to execute within transaction
 * @returns {Promise<T>}
 */
export async function transaction(fn) {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const result = await fn(client);
		await client.query('COMMIT');
		return result;
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}
