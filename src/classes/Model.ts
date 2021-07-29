import { ModelClass, } from '../types/Model';
import fs from 'fs';
import fsPromise from 'fs/promises';

import Schema from './Schema';

class Model implements ModelClass {
	model: string;
	schema: Schema;
	private path: string = '';

	constructor(model: string, schema: Schema) {
		this.model = model;
		this.schema = schema;
	}

	async createTable(): Promise<any> {
		try {
			const schema = this.schema.schema;
			const modelsWithRelation: string[] = [];
			Object.keys(schema).map((obj) => {
				let schemaRelation = schema[obj].relation?.modelName;
				if (typeof schemaRelation === 'string') {
					modelsWithRelation.push(schemaRelation)
				}
			});
			modelsWithRelation.push(this.model);
			if (modelsWithRelation.length > 0) {
				modelsWithRelation.map(async (model) => {
					let path = `${this.path}/${model}.json`;
					if (!fs.existsSync(path)) await fsPromise.writeFile(path, '[]');
				})
			} else {
				const path = `${this.path}/${this.model}.json`;
				if (!fs.existsSync(path)) await fsPromise.writeFile(path, '[]');
			}

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async create(data: any): Promise<object> {
		try {
			const schema = this.schema.schema;
			const schemaStructure: any = { id: 1, ...data };
			const allData: Array<any> = await this.findAll();
			const error: any = {};

			Object.keys(schema).map(async (obj) => {
				let dataType = typeof data[obj];
				let schemaType = schema[obj].type;
				let dataObjKeys = Object.keys(data);
				let schemaDefaultValue = schema[obj].default;
				let schemaRelation = schema[obj].relation?.modelName;

				if (!dataObjKeys.includes(obj) && typeof schemaDefaultValue == 'undefined') error.message = `Expected param '${obj}'`;
				if (dataType != schemaType && typeof schemaDefaultValue == 'undefined') error.message = `the type '${dataType}' is not expected. Expected is: ${schemaType}`;
				if (typeof schemaRelation != 'undefined' && typeof schemaDefaultValue != 'undefined') error.message = `Not expected a default value to relation at Schema '${this.model}'`;

				if (schemaRelation) {
					var schemaParam = schemaStructure[obj];
					var relation = JSON.parse(await fsPromise.readFile(`${this.path}/${schemaRelation}.json`, { encoding: 'utf8' }));
					var relFind = relation.find((res: any) => res.id == schemaParam);

					if (!relFind) error.message = `Cannot find schema ${schemaRelation} with [id: ${schemaParam}]`;

				}

				if (typeof schemaDefaultValue != 'undefined') {
					schemaStructure[obj] = schemaDefaultValue;
					Object.keys(data).map((dataObj) => {
						if (!schema[dataObj]) delete schemaStructure[dataObj];
					});
				}

			});

			if (error.message) throw new Error(error.message)

			if (allData.length <= 0) {
				await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify([schemaStructure]));
			} else {
				schemaStructure.id = allData[allData.length - 1].id + 1;
				allData.push(schemaStructure);
				await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify(allData));
			}

			return schemaStructure;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async findAll(): Promise<Array<any>> {
		try {
			const schema = this.schema.schema;
			const response = JSON.parse(await fsPromise.readFile(`${this.path}/${this.model}.json`, { encoding: 'utf8' }));
			var newResponse: any[] = [];

			Object.keys(schema).map((obj) => {
				let schemaRelationName = schema[obj].relation?.name;
				let schemaRelation = schema[obj].relation?.modelName;
				if (schemaRelation) {
					let relationModel = JSON.parse(fs.readFileSync(`${this.path}/${schemaRelation}.json`, { encoding: 'utf8' }));
					let relationResponse: any;
					response.map((res: any) => {
						if (typeof schemaRelationName != 'undefined') {
							relationResponse = res[schemaRelationName] = relationModel.find((rel: any) => rel.id == res[obj]);
							delete res[obj];
							return relationResponse;
						}
						return res[obj] = relationModel.find((rel: any) => rel.id == res[obj]);
					})
					newResponse = response;
				}
			});

			return newResponse.length > 0 ? newResponse : response;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async find(param: string, value: any): Promise<Array<any>> {
		try {
			const allData = await this.findAll();

			return allData.find(data => data[param] == value);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async delete(param: string, value: any): Promise<void> {
		try {
			const allData = await this.findAll();
			const newData = allData.filter(data => data[param] != value);
			await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify(newData));
		} catch (error) {
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
