import { query } from './db.js';

/**
 * Get all workloads with customer info and latest event status
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function getAllWorkloads() {
	const result = await query(`
		SELECT
			w.*,
			c.name as customer_name,
			latest_event.stage as current_stage,
			latest_event.size as current_size
		FROM workloads w
		JOIN customers c ON w.customer = c.customer
		LEFT JOIN LATERAL (
			SELECT stage, size
			FROM events
			WHERE workload = w.workload
			ORDER BY happened_at DESC
			LIMIT 1
		) latest_event ON true
		ORDER BY c.name ASC, w.name ASC
	`);
	return result.rows;
}

/**
 * Get a workload by label with customer info and latest event status
 * @param {string} label
 * @returns {Promise<import('$lib/types').WorkloadWithStatus | null>}
 */
export async function getWorkloadByLabel(label) {
	const result = await query(`
		SELECT
			w.*,
			c.name as customer_name,
			latest_event.stage as current_stage,
			latest_event.size as current_size
		FROM workloads w
		JOIN customers c ON w.customer = c.customer
		LEFT JOIN LATERAL (
			SELECT stage, size
			FROM events
			WHERE workload = w.workload
			ORDER BY happened_at DESC
			LIMIT 1
		) latest_event ON true
		WHERE w.label = $1
	`, [label]);
	return result.rows[0] || null;
}

/**
 * Get a workload by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Workload | null>}
 */
export async function getWorkloadById(id) {
	const result = await query(
		'SELECT * FROM workloads WHERE workload = $1',
		[id]
	);
	return result.rows[0] || null;
}

/**
 * Get workloads by customer UUID
 * @param {string} customerId
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function getWorkloadsByCustomer(customerId) {
	const result = await query(`
		SELECT
			w.*,
			c.name as customer_name,
			latest_event.stage as current_stage,
			latest_event.size as current_size
		FROM workloads w
		JOIN customers c ON w.customer = c.customer
		LEFT JOIN LATERAL (
			SELECT stage, size
			FROM events
			WHERE workload = w.workload
			ORDER BY happened_at DESC
			LIMIT 1
		) latest_event ON true
		WHERE w.customer = $1
		ORDER BY w.name ASC
	`, [customerId]);
	return result.rows;
}

/**
 * Create a new workload
 * @param {import('$lib/types').WorkloadInput} input
 * @returns {Promise<import('$lib/types').Workload>}
 */
export async function createWorkload(input) {
	const result = await query(
		`INSERT INTO workloads (label, customer, name)
		 VALUES ($1, $2, $3)
		 RETURNING *`,
		[input.label, input.customer, input.name]
	);
	return result.rows[0];
}

/**
 * Update a workload
 * @param {string} label
 * @param {import('$lib/types').WorkloadInput} input
 * @returns {Promise<import('$lib/types').Workload | null>}
 */
export async function updateWorkload(label, input) {
	const result = await query(
		`UPDATE workloads
		 SET label = $1, customer = $2, name = $3, updated_at = NOW()
		 WHERE label = $4
		 RETURNING *`,
		[input.label, input.customer, input.name, label]
	);
	return result.rows[0] || null;
}

/**
 * Delete a workload
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteWorkload(label) {
	const result = await query(
		'DELETE FROM workloads WHERE label = $1',
		[label]
	);
	return result.rowCount > 0;
}

/**
 * Search workloads by name or label
 * @param {string} searchTerm
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function searchWorkloads(searchTerm, limit = 10) {
	const result = await query(`
		SELECT
			w.*,
			c.name as customer_name,
			latest_event.stage as current_stage,
			latest_event.size as current_size
		FROM workloads w
		JOIN customers c ON w.customer = c.customer
		LEFT JOIN LATERAL (
			SELECT stage, size
			FROM events
			WHERE workload = w.workload
			ORDER BY happened_at DESC
			LIMIT 1
		) latest_event ON true
		WHERE w.name ILIKE $1 OR w.label ILIKE $1
		ORDER BY w.name ASC
		LIMIT $2
	`, [`%${searchTerm}%`, limit]);
	return result.rows;
}
