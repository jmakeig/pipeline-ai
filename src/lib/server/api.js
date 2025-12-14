import { query } from './db.js';
import { Validation } from '$lib/validation.js';
import { STAGES, REGIONS, SEGMENTS } from '$lib/constants.js';

// =============================================================================
// Customers
// =============================================================================

/**
 * @typedef {object} CustomerFormData
 * @property {string} label
 * @property {string} name
 * @property {string} region
 * @property {string} segment
 * @property {string} industry
 */

/**
 * Validate customer form data
 * @param {CustomerFormData} data
 * @returns {Validation<import('$lib/types').CustomerInput>}
 */
export function validateCustomer(data) {
	const validation = new Validation();

	if (!data.label?.trim()) validation.add('Label is required', 'label');
	if (!data.name?.trim()) validation.add('Name is required', 'name');
	if (!data.region) validation.add('Region is required', 'region');
	else if (!REGIONS.includes(/** @type {any} */ (data.region))) {
		validation.add('Invalid region', 'region');
	}
	if (!data.segment) validation.add('Segment is required', 'segment');
	else if (!SEGMENTS.includes(/** @type {any} */ (data.segment))) {
		validation.add('Invalid segment', 'segment');
	}
	if (!data.industry?.trim()) validation.add('Industry is required', 'industry');

	return validation;
}

/**
 * Get the total count of customers
 * @returns {Promise<number>}
 */
export async function getCustomerCount() {
	const result = await query('SELECT COUNT(*) as count FROM customers');
	return parseInt(result.rows[0].count, 10);
}

/**
 * Get all customers
 * @returns {Promise<import('$lib/types').Customer[]>}
 */
export async function getAllCustomers() {
	const result = await query('SELECT * FROM customers ORDER BY name ASC');
	return result.rows;
}

/**
 * Get a customer by label
 * @param {string} label
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function getCustomerByLabel(label) {
	const result = await query('SELECT * FROM customers WHERE label = $1', [label]);
	return result.rows[0] || null;
}

/**
 * Get a customer by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function getCustomerById(id) {
	const result = await query('SELECT * FROM customers WHERE customer = $1', [id]);
	return result.rows[0] || null;
}

/**
 * @typedef {object} CreateCustomerResult
 * @property {import('$lib/types').Customer} [customer]
 * @property {Validation<import('$lib/types').CustomerInput>} [validation]
 */

/**
 * Create a new customer with validation
 * @param {CustomerFormData} data
 * @returns {Promise<CreateCustomerResult>}
 */
export async function createCustomer(data) {
	const validation = validateCustomer(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`INSERT INTO customers (label, name, region, segment, industry)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING *`,
			[data.label.trim(), data.name.trim(), data.region, data.segment, data.industry.trim()]
		);
		return { customer: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('A customer with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * @typedef {object} UpdateCustomerResult
 * @property {import('$lib/types').Customer} [customer]
 * @property {Validation<import('$lib/types').CustomerInput>} [validation]
 * @property {boolean} [notFound]
 */

/**
 * Update a customer with validation
 * @param {string} currentLabel
 * @param {CustomerFormData} data
 * @returns {Promise<UpdateCustomerResult>}
 */
export async function updateCustomer(currentLabel, data) {
	const validation = validateCustomer(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`UPDATE customers
			 SET label = $1, name = $2, region = $3, segment = $4, industry = $5, updated_at = NOW()
			 WHERE label = $6
			 RETURNING *`,
			[data.label.trim(), data.name.trim(), data.region, data.segment, data.industry.trim(), currentLabel]
		);
		if (!result.rows[0]) {
			return { notFound: true };
		}
		return { customer: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('A customer with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * Delete a customer
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteCustomer(label) {
	const result = await query('DELETE FROM customers WHERE label = $1', [label]);
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

// =============================================================================
// Workloads
// =============================================================================

/**
 * @typedef {object} WorkloadFormData
 * @property {string} label
 * @property {string} name
 * @property {string} customer
 */

/**
 * Validate workload form data
 * @param {WorkloadFormData} data
 * @returns {Validation<import('$lib/types').WorkloadInput>}
 */
export function validateWorkload(data) {
	const validation = new Validation();

	if (!data.label?.trim()) validation.add('Label is required', 'label');
	if (!data.name?.trim()) validation.add('Name is required', 'name');
	if (!data.customer) validation.add('Customer is required', 'customer');

	return validation;
}

/**
 * Get the total count of workloads
 * @returns {Promise<number>}
 */
export async function getWorkloadCount() {
	const result = await query('SELECT COUNT(*) as count FROM workloads');
	return parseInt(result.rows[0].count, 10);
}

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
	const result = await query(
		`
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
	`,
		[label]
	);
	return result.rows[0] || null;
}

/**
 * Get a workload by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Workload | null>}
 */
export async function getWorkloadById(id) {
	const result = await query('SELECT * FROM workloads WHERE workload = $1', [id]);
	return result.rows[0] || null;
}

/**
 * Get workloads by customer UUID
 * @param {string} customerId
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function getWorkloadsByCustomer(customerId) {
	const result = await query(
		`
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
	`,
		[customerId]
	);
	return result.rows;
}

/**
 * @typedef {object} CreateWorkloadResult
 * @property {import('$lib/types').Workload} [workload]
 * @property {Validation<import('$lib/types').WorkloadInput>} [validation]
 */

/**
 * Create a new workload with validation
 * @param {WorkloadFormData} data
 * @returns {Promise<CreateWorkloadResult>}
 */
export async function createWorkload(data) {
	const validation = validateWorkload(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`INSERT INTO workloads (label, customer, name)
			 VALUES ($1, $2, $3)
			 RETURNING *`,
			[data.label.trim(), data.customer, data.name.trim()]
		);
		return { workload: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('A workload with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * @typedef {object} UpdateWorkloadResult
 * @property {import('$lib/types').Workload} [workload]
 * @property {Validation<import('$lib/types').WorkloadInput>} [validation]
 * @property {boolean} [notFound]
 */

/**
 * Update a workload with validation
 * @param {string} currentLabel
 * @param {WorkloadFormData} data
 * @returns {Promise<UpdateWorkloadResult>}
 */
export async function updateWorkload(currentLabel, data) {
	const validation = validateWorkload(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`UPDATE workloads
			 SET label = $1, customer = $2, name = $3, updated_at = NOW()
			 WHERE label = $4
			 RETURNING *`,
			[data.label.trim(), data.customer, data.name.trim(), currentLabel]
		);
		if (!result.rows[0]) {
			return { notFound: true };
		}
		return { workload: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('A workload with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * Delete a workload
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteWorkload(label) {
	const result = await query('DELETE FROM workloads WHERE label = $1', [label]);
	return result.rowCount > 0;
}

/**
 * Search workloads by name or label
 * @param {string} searchTerm
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function searchWorkloads(searchTerm, limit = 10) {
	const result = await query(
		`
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
	`,
		[`%${searchTerm}%`, limit]
	);
	return result.rows;
}

// =============================================================================
// Events
// =============================================================================

/**
 * @typedef {object} EventFormData
 * @property {string} label
 * @property {string | null} customer
 * @property {string | null} workload
 * @property {string} outcome
 * @property {number | null} stage
 * @property {number | null} size
 */

/**
 * Validate event form data
 * @param {EventFormData} data
 * @returns {Validation<import('$lib/types').EventInput>}
 */
export function validateEvent(data) {
	const validation = new Validation();

	if (!data.label?.trim()) validation.add('Label is required', 'label');
	if (!data.customer && !data.workload) {
		validation.add('Either customer or workload is required', 'entity');
	}
	if (data.customer && data.workload) {
		validation.add('Cannot have both customer and workload', 'entity');
	}
	if (!data.outcome?.trim()) validation.add('Outcome is required', 'outcome');
	if (data.stage !== null) {
		const validStages = STAGES.map((s) => s.value);
		if (!validStages.includes(/** @type {any} */ (data.stage))) {
			validation.add('Invalid stage', 'stage');
		}
	}
	if (data.size !== null && data.size < 0) {
		validation.add('Size cannot be negative', 'size');
	}

	return validation;
}

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
	const result = await query(
		`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.label = $1
	`,
		[label]
	);
	return result.rows[0] || null;
}

/**
 * Get events for a customer
 * @param {string} customerId
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function getEventsByCustomer(customerId) {
	const result = await query(
		`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.customer = $1
		ORDER BY e.happened_at DESC
	`,
		[customerId]
	);
	return result.rows;
}

/**
 * Get events for a workload
 * @param {string} workloadId
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function getEventsByWorkload(workloadId) {
	const result = await query(
		`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.workload = $1
		ORDER BY e.happened_at DESC
	`,
		[workloadId]
	);
	return result.rows;
}

/**
 * @typedef {object} CreateEventResult
 * @property {import('$lib/types').Event} [event]
 * @property {Validation<import('$lib/types').EventInput>} [validation]
 */

/**
 * Create a new event with validation
 * @param {EventFormData} data
 * @returns {Promise<CreateEventResult>}
 */
export async function createEvent(data) {
	const validation = validateEvent(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`INSERT INTO events (label, customer, workload, outcome, stage, size)
			 VALUES ($1, $2, $3, $4, $5, $6)
			 RETURNING *`,
			[data.label.trim(), data.customer, data.workload, data.outcome.trim(), data.stage, data.size]
		);
		return { event: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('An event with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * @typedef {object} UpdateEventResult
 * @property {import('$lib/types').Event} [event]
 * @property {Validation<import('$lib/types').EventInput>} [validation]
 * @property {boolean} [notFound]
 */

/**
 * Update an event with validation
 * @param {string} currentLabel
 * @param {EventFormData} data
 * @returns {Promise<UpdateEventResult>}
 */
export async function updateEvent(currentLabel, data) {
	const validation = validateEvent(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`UPDATE events
			 SET label = $1, customer = $2, workload = $3, outcome = $4, stage = $5, size = $6
			 WHERE label = $7
			 RETURNING *`,
			[data.label.trim(), data.customer, data.workload, data.outcome.trim(), data.stage, data.size, currentLabel]
		);
		if (!result.rows[0]) {
			return { notFound: true };
		}
		return { event: result.rows[0] };
	} catch (e) {
		const error = /** @type {Error} */ (e);
		if (error.message?.includes('unique constraint')) {
			validation.add('An event with this label already exists', 'label');
			return { validation };
		}
		throw e;
	}
}

/**
 * Delete an event
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export async function deleteEvent(label) {
	const result = await query('DELETE FROM events WHERE label = $1', [label]);
	return result.rowCount > 0;
}

/**
 * Search both customers and workloads for EntitySearch component
 * @param {string} searchTerm
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').EntitySearchResult[]>}
 */
export async function searchEntities(searchTerm, limit = 10) {
	const result = await query(
		`
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
	`,
		[`%${searchTerm}%`, limit]
	);
	return result.rows;
}
