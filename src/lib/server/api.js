import { query, transaction } from './db.js';
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
export function validate_customer(data) {
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
export async function get_customer_count() {
	const result = await query('SELECT COUNT(*) as count FROM customers');
	return parseInt(result.rows[0].count, 10);
}

/**
 * Get all customers
 * @returns {Promise<import('$lib/types').Customer[]>}
 */
export async function get_all_customers() {
	const result = await query('SELECT * FROM customers ORDER BY name ASC');
	return result.rows;
}

/**
 * Get a customer by label
 * @param {string} label
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function get_customer_by_label(label) {
	const result = await query('SELECT * FROM customers WHERE label = $1', [label]);
	return result.rows[0] || null;
}

/**
 * Get a customer by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Customer | null>}
 */
export async function get_customer_by_id(id) {
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
export async function create_customer(data) {
	const validation = validate_customer(data);

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
 * @property {boolean} [not_found]
 */

/**
 * Update a customer with validation
 * @param {string} current_label
 * @param {CustomerFormData} data
 * @returns {Promise<UpdateCustomerResult>}
 */
export async function update_customer(current_label, data) {
	const validation = validate_customer(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`UPDATE customers
			 SET label = $1, name = $2, region = $3, segment = $4, industry = $5, updated_at = NOW()
			 WHERE label = $6
			 RETURNING *`,
			[data.label.trim(), data.name.trim(), data.region, data.segment, data.industry.trim(), current_label]
		);
		if (!result.rows[0]) {
			return { not_found: true };
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
export async function delete_customer(label) {
	const result = await query('DELETE FROM customers WHERE label = $1', [label]);
	return result.rowCount > 0;
}

/**
 * Search customers by name or label
 * @param {string} search_term
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').Customer[]>}
 */
export async function search_customers(search_term, limit = 10) {
	const result = await query(
		`SELECT * FROM customers
		 WHERE name ILIKE $1 OR label ILIKE $1
		 ORDER BY name ASC
		 LIMIT $2`,
		[`%${search_term}%`, limit]
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
export function validate_workload(data) {
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
export async function get_workload_count() {
	const result = await query('SELECT COUNT(*) as count FROM workloads');
	return parseInt(result.rows[0].count, 10);
}

/**
 * Get all workloads with customer info and latest event status
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function get_all_workloads() {
	const result = await query(`
		SELECT workload, label, customer, name, created_at, updated_at,
		       customer_name, customer_label, current_stage, current_size
		FROM pipeline
		ORDER BY customer_name ASC, name ASC
	`);
	return result.rows;
}

/**
 * Get a workload by label with customer info and latest event status
 * @param {string} label
 * @returns {Promise<import('$lib/types').WorkloadWithStatus | null>}
 */
export async function get_workload_by_label(label) {
	const result = await query(
		`SELECT workload, label, customer, name, created_at, updated_at,
		        customer_name, customer_label, current_stage, current_size
		 FROM pipeline
		 WHERE label = $1`,
		[label]
	);
	return result.rows[0] || null;
}

/**
 * Get a workload by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').Workload | null>}
 */
export async function get_workload_by_id(id) {
	const result = await query(
		`SELECT workload, label, customer, name, created_at, updated_at
		 FROM workloads
		 WHERE workload = $1`,
		[id]
	);
	return result.rows[0] || null;
}

/**
 * Get workloads by customer UUID
 * @param {string} customer_id
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function get_workloads_by_customer(customer_id) {
	const result = await query(
		`SELECT workload, label, customer, name, created_at, updated_at,
		        customer_name, customer_label, current_stage, current_size
		 FROM pipeline
		 WHERE customer = $1
		 ORDER BY name ASC`,
		[customer_id]
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
export async function create_workload(data) {
	const validation = validate_workload(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`INSERT INTO workloads (label, customer, name)
			 VALUES ($1, $2, $3)
			 RETURNING workload, label, customer, name, created_at, updated_at`,
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
 * @typedef {object} WorkloadWithEventData
 * @property {string} label
 * @property {string} name
 * @property {string} customer
 * @property {number | null} stage
 * @property {number | null} size
 */

/**
 * Create a new workload with an initial event in a single transaction
 * @param {WorkloadWithEventData} data
 * @returns {Promise<CreateWorkloadResult>}
 */
export async function create_workload_with_event(data) {
	const validation = validate_workload(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const workload = await transaction(async (client) => {
			const workload_result = await client.query(
				`INSERT INTO workloads (label, customer, name)
				 VALUES ($1, $2, $3)
				 RETURNING workload, label, customer, name, created_at, updated_at`,
				[data.label.trim(), data.customer, data.name.trim()]
			);

			const workload = workload_result.rows[0];

			await client.query(
				`INSERT INTO events (customer, workload, outcome, stage, size)
				 VALUES ($1, $2, $3, $4, $5)`,
				[null, workload.workload, 'Workload created', data.stage, data.size]
			);

			return workload;
		});

		return { workload };
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
 * @property {boolean} [not_found]
 */

/**
 * Update a workload with validation
 * @param {string} current_label
 * @param {WorkloadFormData} data
 * @returns {Promise<UpdateWorkloadResult>}
 */
export async function update_workload(current_label, data) {
	const validation = validate_workload(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	try {
		const result = await query(
			`UPDATE workloads
			 SET label = $1, customer = $2, name = $3, updated_at = NOW()
			 WHERE label = $4
			 RETURNING workload, label, customer, name, created_at, updated_at`,
			[data.label.trim(), data.customer, data.name.trim(), current_label]
		);
		if (!result.rows[0]) {
			return { not_found: true };
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
export async function delete_workload(label) {
	const result = await query('DELETE FROM workloads WHERE label = $1', [label]);
	return result.rowCount > 0;
}

/**
 * Search workloads by name or label
 * @param {string} search_term
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').WorkloadWithStatus[]>}
 */
export async function search_workloads(search_term, limit = 10) {
	const result = await query(
		`SELECT workload, label, customer, name, created_at, updated_at,
		        customer_name, customer_label, current_stage, current_size
		 FROM pipeline
		 WHERE name ILIKE $1 OR label ILIKE $1
		 ORDER BY name ASC
		 LIMIT $2`,
		[`%${search_term}%`, limit]
	);
	return result.rows;
}

// =============================================================================
// Events
// =============================================================================

/**
 * @typedef {object} EventFormData
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
export function validate_event(data) {
	const validation = new Validation();

	if (!data.customer && !data.workload) {
		validation.add('Either customer or workload is required', 'entity');
	}
	if (data.customer && data.workload) {
		validation.add('Cannot have both customer and workload', 'entity');
	}
	if (!data.outcome?.trim()) validation.add('Outcome is required', 'outcome');
	if (data.stage !== null) {
		const valid_stages = STAGES.map((s) => s.value);
		if (!valid_stages.includes(/** @type {any} */ (data.stage))) {
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
export async function get_all_events() {
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
 * Get an event by UUID
 * @param {string} id
 * @returns {Promise<import('$lib/types').EventWithNames | null>}
 */
export async function get_event_by_id(id) {
	const result = await query(
		`
		SELECT
			e.*,
			c.name as customer_name,
			w.name as workload_name
		FROM events e
		LEFT JOIN customers c ON e.customer = c.customer
		LEFT JOIN workloads w ON e.workload = w.workload
		WHERE e.event = $1
	`,
		[id]
	);
	return result.rows[0] || null;
}

/**
 * Get events for a customer
 * @param {string} customer_id
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function get_events_by_customer(customer_id) {
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
		[customer_id]
	);
	return result.rows;
}

/**
 * Get events for a workload
 * @param {string} workload_id
 * @returns {Promise<import('$lib/types').EventWithNames[]>}
 */
export async function get_events_by_workload(workload_id) {
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
		[workload_id]
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
export async function create_event(data) {
	const validation = validate_event(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	const result = await query(
		`INSERT INTO events (customer, workload, outcome, stage, size)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING *`,
		[data.customer, data.workload, data.outcome.trim(), data.stage, data.size]
	);
	return { event: result.rows[0] };
}

/**
 * @typedef {object} UpdateEventResult
 * @property {import('$lib/types').Event} [event]
 * @property {Validation<import('$lib/types').EventInput>} [validation]
 * @property {boolean} [not_found]
 */

/**
 * Update an event with validation
 * @param {string} event_id
 * @param {EventFormData} data
 * @returns {Promise<UpdateEventResult>}
 */
export async function update_event(event_id, data) {
	const validation = validate_event(data);

	if (!validation.is_valid()) {
		return { validation };
	}

	const result = await query(
		`UPDATE events
		 SET customer = $1, workload = $2, outcome = $3, stage = $4, size = $5
		 WHERE event = $6
		 RETURNING *`,
		[data.customer, data.workload, data.outcome.trim(), data.stage, data.size, event_id]
	);
	if (!result.rows[0]) {
		return { not_found: true };
	}
	return { event: result.rows[0] };
}

/**
 * Delete an event
 * @param {string} event_id
 * @returns {Promise<boolean>}
 */
export async function delete_event(event_id) {
	const result = await query('DELETE FROM events WHERE event = $1', [event_id]);
	return result.rowCount > 0;
}

/**
 * Search both customers and workloads for EntitySearch component
 * @param {string} search_term
 * @param {number} [limit=10]
 * @returns {Promise<import('$lib/types').EntitySearchResult[]>}
 */
export async function search_entities(search_term, limit = 10) {
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
		[`%${search_term}%`, limit]
	);
	return result.rows;
}
