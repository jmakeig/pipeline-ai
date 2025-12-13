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
