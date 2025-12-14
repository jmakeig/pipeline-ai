export type Path = PropertyKey[];

export interface Issue {
	message: string;
	path?: Path;
}

export interface Invalid<In, Out, Prop extends string = 'input'> {
	validation: import('./validation').Validation<Out>;
	[key: string]: In | import('./validation').Validation<Out>;
}

export type MaybeInvalid<In, Out, Prop extends string = 'input'> = Out | Invalid<In, Out, Prop>;
