export interface SchemaClass{
	schema: SchemaObject
}

export type SchemaObject = {
	[tableName in string]: {
		type: 'string' | 'number' | 'boolean';
		required: boolean;
		relation?: {
			modelName: string;
		};
	};
}
