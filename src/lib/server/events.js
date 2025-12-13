import { query } from './db.js';

/**
 * Get all events with related entity names
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function getAllEvents() {
	const result = await query(`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		ORDER BY e.happened_at DESC
	`);
	return result.rows;
}

/**
 * Get an event by label
 * @param {string} label
 * @returns {Promise<import('$lib/types').EventWithNames | null>}
 */
export async function getEventByLabel(label) {
	const result = await query(`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.label = $1
	`, [label]);
	return result.rows[0] || null;
}

/**
 * Get events for a customer
 * @param {string} customerId
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function getEventsByCustomer(customerId) {
	const result = await query(`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.customer = $1
		ORDER BY e.happened_at DESC
	`, [customerId]);
	return result.rows;
}

/**
 * Get events for a workload
 * @param {string} workloadId
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function getEventsByWorkload(workloadId) {
	const result = await query(`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.workload = $1
		ORDER BY e.happened_at DESC
	`, [workloadId]);
	return result.rows;
}

/**
 * Create a new event
 * @param {import('$lib/types').EventInput} input
 * @returns {Promise<import('$lib/types').Event>}
 */
export async function createEvent(input) {
	const result = await query(
		`INSERT INTO events (label, customer, workload, outcome, stage, size)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING *`,
		[input.label, input.customer, input.workload, input.outcome, input.stage, input.size]
	);
	return result.rows[0];
}

/**
 * Update an event
 * @param {string} label
 * @param {import('$lib/types').EventInput} input
 * @returns {Promise<import('$lib/types').Event | null>}
 */
export async function updateEvent(label, input) {
	const result = await query(
		`UPDATE events
		 SET label = $1, customer = $2, workload = $3, outcome = $4, stage = $5, size = $6
		 WHERE label = $7
		 RETURNING *`,
		[input.label, input.customer, input.workload, input.outcome, input.stage, input.size, label]
	);
	return result.rows[0] || null;
}

/**
 * Delete an event
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteEvent(label) {
	const result = await query(
		'DELETE FROM events WHERE label = $1',
		[label]
	);
	return result.rowCount > 0;
}

/**
 * Search both customers and workloads for EntitySearch component
 * @param {string} searchTerm
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').EntitySearchResult[]>}
 */
export async function searchEntities(searchTerm, limit = 10) {
	const result = await query(`
		(
			SELECT
				'customer' as type,
				customer as id,
				label,
				name,
				region || ' / ' || segment as subtitle
			FROM customers
			WHERE name ILIKE $1 OR label ILIKE $1
			ORDER BY name ASC
			LIMIT $2
		)
		UNION ALL
		(
			SELECT
				'workload' as type,
				w.workload as id,
				w.label,
				w.name,
				c.name as subtitle
			FROM workloads w
			JOIN customers c ON w.customer = c.customer
			WHERE w.name ILIKE $1 OR w.label ILIKE $1
			ORDER BY w.name ASC
			LIMIT $2
		)
		LIMIT $2
	`, [`%${searchTerm}%`, limit]);
	return result.rows;
}
