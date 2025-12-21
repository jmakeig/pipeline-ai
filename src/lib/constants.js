/** @type {import('$lib/types').StageInfo[]} */
export const STAGES = [
	{ value: 1, label: '1-Qualifying', terminal: false },
	{ value: 2, label: '2-Proof-of-Concept', terminal: false },
	{ value: 3, label: '3-Deciding', terminal: false },
	{ value: 4, label: '4-Implementation and Migration', terminal: false },
	{ value: 5, label: '5-Production', terminal: false },
	{ value: 90, label: '90-Stale', terminal: true },
	{ value: 91, label: '91-Disqualified', terminal: true },
	{ value: 92, label: '92-Lost', terminal: true },
	{ value: 99, label: '99-Closed', terminal: true }
];

/** @type {import('$lib/types').Region[]} */
export const REGIONS = ['NORTHAM', 'EMEA', 'JAPAC', 'LATAM'];

/** @type {import('$lib/types').Segment[]} */
export const SEGMENTS = ['Select', 'Enterprise', 'SMB'];

/**
 * Get stage info by value
 * @param {import('$lib/types').Stage | null} value
 * @returns {import('$lib/types').StageInfo | null}
 */
export function get_stage_info(value) {
	if (value === null) return null;
	return STAGES.find((s) => s.value === value) || null;
}

/**
 * Format currency amount
 * @param {number | null} amount
 * @returns {string}
 */
export function format_currency(amount) {
	if (amount === null) return '-';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

/**
 * Format date for display
 * @param {Date | string} date
 * @returns {string}
 */
export function format_date(date) {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format datetime for display
 * @param {Date | string} date
 * @returns {string}
 */
export function format_date_time(date) {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit'
	});
}

/**
 * Turns a string into a URL-ready slug
 *
 * @param {string} name
 * @returns {string}
 */
export function slug(name) {
	const maxLength = 80;
	let len = 0,
		index = 0,
		slug = '';
	// https://stackoverflow.com/a/66721429
	const tokens = name.split(/[^\p{L}\p{N}]+/gu);
	while (len < maxLength && index < tokens.length) {
		len += tokens[index].length;
		if (tokens[index].length > 0) {
			slug += (index > 0 ? '-' : '') + tokens[index++].toLowerCase();
		} else {
			index++;
		}
	}
	return slug;
}