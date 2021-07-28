import path from 'path';
import fs from 'fs';
import { Pyniedb, ConnectOptions } from './types/PynieDB';
import { SchemaObject } from './types/Schema';

import Model from './classes/Model';
import SchemaClass from './classes/Schema';

class PynieDB implements Pyniedb {
	fullPath: string = ''

	connect (dbName: string, options: ConnectOptions) {
		let fullPath: string = '';
		let pathArray: string[] = [];

		fullPath = path.normalize(options.path);
		pathArray = options.path.split('/');

		if (pathArray[pathArray.length - 1] != '') {
			this.fullPath = `${fullPath}/${dbName}`;
		} else this.fullPath = `${fullPath}${dbName}`;

		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath);
			if (fs.existsSync(fullPath)) fs.mkdirSync(this.fullPath);
			console.log(`\ndatabase '${dbName}' created\n`);
		}
	}

	Model (modelName: string, schema: SchemaClass) {
		const model = new Model(modelName, schema);
		model.setPath(this.fullPath);
		model.createTable();
		model.verifySchemaCreated();
		return model;
	}
}

function Schema (schemaData: SchemaObject) {
	const schema = new SchemaClass(schemaData);
	return schema;
}

export default new PynieDB();
export { Schema }
