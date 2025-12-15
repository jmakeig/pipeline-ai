// Region enum values
export type Region = 'NORTHAM' | 'EMEA' | 'JAPAC' | 'LATAM';

// Segment enum values
export type Segment = 'Select' | 'Enterprise' | 'SMB';

// Pipeline stage values
export type Stage = 1 | 2 | 3 | 4 | 5 | 90 | 91 | 92 | 99;

// Stage labels for display
export interface StageInfo {
	value: Stage;
	label: string;
	terminal: boolean;
}

// Customer entity
export interface Customer {
	customer: string;
	label: string;
	name: string;
	region: Region;
	segment: Segment;
	industry: string;
	created_at: Date;
	updated_at: Date;
}

// Customer form data (for create/update)
export interface CustomerInput {
	label: string;
	name: string;
	region: Region;
	segment: Segment;
	industry: string;
}

// Workload entity
export interface Workload {
	workload: string;
	label: string;
	customer: string;
	name: string;
	created_at: Date;
	updated_at: Date;
}

// Workload with computed fields from events
export interface WorkloadWithStatus extends Workload {
	customer_name: string;
	customer_label: string;
	current_stage: Stage | null;
	current_size: number | null;
}

// Workload form data (for create/update)
export interface WorkloadInput {
	label: string;
	customer: string;
	name: string;
}

// Event entity
export interface Event {
	event: string;
	label: string;
	customer: string | null;
	workload: string | null;
	happened_at: Date;
	outcome: string;
	stage: Stage | null;
	size: number | null;
	created_at: Date;
}

// Event with related entity names
export interface EventWithNames extends Event {
	customer_name: string | null;
	workload_name: string | null;
}

// Event form data (for create)
export interface EventInput {
	label: string;
	customer: string | null;
	workload: string | null;
	outcome: string;
	stage: Stage | null;
	size: number | null;
}

// Search result for EntitySearch component
export interface EntitySearchResult {
	type: 'customer' | 'workload';
	id: string;
	label: string;
	name: string;
	subtitle: string;
}
