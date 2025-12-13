import { query } from './db.js';

/**
 * Get all customers
 * @returns {Promise<import('$lib/types').Customer[]>}
 */
export async function getAllCustomers() {
	const result = await query(
		'SELECT * FROM customers ORDER BY name ASC'
	);
	return result.rows;
}

/**
 * Get a customer by label
 * @param {string} label
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function getCustomerByLabel(label) {
	const result = await query(
		'SELECT * FROM customers WHERE label = $1',
		[label]
	);
	return result.rows[0] || null;
}

/**
 * Get a customer by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function getCustomerById(id) {
	const result = await query(
		'SELECT * FROM customers WHERE customer = $1',
		[id]
	);
	return result.rows[0] || null;
}

/**
 * Create a new customer
 * @param {import('$lib/types').CustomerInput} input
 * @returns {Promise<import('$lib/types').Customer>}
 */
export async function createCustomer(input) {
	const result = await query(
		`INSERT INTO customers (label, name, region, segment, industry)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING *`,
		[input.label, input.name, input.region, input.segment, input.industry]
	);
	return result.rows[0];
}

/**
 * Update a customer
 * @param {string} label
 * @param {import('$lib/types').CustomerInput} input
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function updateCustomer(label, input) {
	const result = await query(
		`UPDATE customers
		 SET label = $1, name = $2, region = $3, segment = $4, industry = $5, updated_at = NOW()
		 WHERE label = $6
		 RETURNING *`,
		[input.label, input.name, input.region, input.segment, input.industry, label]
	);
	return result.rows[0] || null;
}

/**
 * Delete a customer
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteCustomer(label) {
	const result = await query(
		'DELETE FROM customers WHERE label = $1',
		[label]
	);
	return result.rowCount > 0;
}

/**
 * Search customers by name or label
 * @param {string} searchTerm
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').Customer[]>}
 */
export async function searchCustomers(searchTerm, limit = 10) {
	const result = await query(
		`SELECT * FROM customers
		 WHERE name ILIKE $1 OR label ILIKE $1
		 ORDER BY name ASC
		 LIMIT $2`,
		[`%${searchTerm}%`, limit]
	);
	return result.rows;
}
