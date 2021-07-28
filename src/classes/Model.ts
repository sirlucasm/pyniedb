import { ModelClass, } from '../types/Model';
import fs from 'fs';
import fsPromise from 'fs/promises';

import Schema from './Schema';

class Model implements ModelClass{
	model: string;
	schema: Schema;
	private path: string = '';

	constructor (model: string, schema: Schema) {
		this.model = model;
		this.schema = schema;
	}

	async createTable (): Promise<any> {
		try {
			const path = `${this.path}/${this.model}.json`;
			if (!fs.existsSync(path)) await fsPromise.writeFile(path, '[]');
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async create (data: any): Promise<object> {
		try {
			const schema = this.schema.schema;
			const schemaStructure: any = { id: 1, ...data};
			const allData: Array<any> = await this.findAll();

			Object.keys(schema).map((obj) => {
				let dataType = typeof data[obj];
				let schemaType = schema[obj].type;
				let dataObjKeys = Object.keys(data);
				let schemaDefaultValue = schema[obj].default;

				if (!dataObjKeys.includes(obj) && typeof schemaDefaultValue == 'undefined') throw new Error(`Expected param '${obj}'`);
				if (dataType != schemaType && typeof schemaDefaultValue == 'undefined') throw new Error(`the type '${dataType}' is not expected. Expected is: ${schemaType}`);

				if (typeof schemaDefaultValue != 'undefined') {
					schemaStructure[obj] = schemaDefaultValue;
					Object.keys(data).map((dataObj) => {
						if (!schema[dataObj]) delete schemaStructure[dataObj];
					});
				}
			});

			if (allData.length <= 0) {
				await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify([schemaStructure]));
			} else {
				schemaStructure.id = allData[allData.length - 1].id + 1;
				allData.push(schemaStructure);
				await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify(allData));
			}

			return schemaStructure;
		} catch(error) {
			return Promise.reject(error);
		}
	}

	async findAll(): Promise<Array<any>> {
		try {
			const response = await fsPromise.readFile(`${this.path}/${this.model}.json`, { encoding: 'utf8' });

			return JSON.parse(response);
		} catch(error) {
			return Promise.reject(error);
		}
	}

	async find(param: string, value: any): Promise<Array<any>> {
		try {
			const allData = await this.findAll();

			return allData.find(data => data[param] == value);
		} catch(error) {
			return Promise.reject(error);
		}
	}

	async delete(param: string, value: any): Promise<void> {
		try {
			const allData = await this.findAll();
			const newData = allData.filter(data => data[param] != value);
			await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify(newData));
		} catch(error) {
			return Promise.reject(error);
		}
	}

	verifySchemaCreated(): void {
		if (typeof this.schema != 'object') throw new Error('The Schema has not been declared');
	}

	setPath(path: string): void {
		this.path = path;
	}
}

export default Model;
