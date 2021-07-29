export interface SchemaClass{
	schema: SchemaObject
}

export type SchemaObject = {
	[tableName in string]: {
		type: 'string' | 'number' | 'boolean';
		default?: string | number | boolean;
		relation?: {
			name?: string;
			modelName: string;
		};
	};
}
