import { SchemaClass, SchemaObject } from '../types/Schema';


class Schema implements SchemaClass{
	schema: SchemaObject;

	constructor (schema: SchemaObject) {
		this.schema = schema;
	}

}

export default Schema;
