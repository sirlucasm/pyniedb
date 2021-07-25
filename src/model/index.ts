import { IModel, ISchemaStructure } from '../types/Model';
import fs from 'fs';
import fsPromise from 'fs/promises';

class Model implements IModel{
	model: string;
	private path: string = '';

	constructor (model: string) {
		this.model = model;
	}

	async createTable (): Promise<any> {
		try {
			const path = `${this.path}/${this.model}.json`;
			if (!fs.existsSync(path)) await fsPromise.writeFile(path, '[]');
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async create (data: object): Promise<object> {
		try {
			const schemaStructure: ISchemaStructure = { id: 1, ...data };

			const allData: Array<any> = await this.findAll();

			if (allData.length <= 0) {
				await fsPromise.writeFile(`${this.path}/${this.model}.json`, JSON.stringify([schemaStructure]));
			} else {
				schemaStructure.id = allData[allData.length - 1].id + 1;
				allData.push(schemaStructure);
				console.log(allData);
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

			return allData.find(data => data[param] === value);
		} catch(error) {
			return Promise.reject(error);
		}
	}

	setPath(path: string) {
		this.path = path;
	}
}

export default Model;
