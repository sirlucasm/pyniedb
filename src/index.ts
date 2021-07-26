import path from 'path';
import fs from 'fs';
import { IPynieDB, IConnectOptions } from './types/PynieDB';

import Model from './model';

class PynieDB implements IPynieDB {
	fullPath: string = '';

	connect (dbName: string, options: IConnectOptions) {
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

	Model (modelName: string) {
		const model = new Model(modelName);
		model.setPath(this.fullPath);
		model.createTable();
		return model;
	}
}

export default new PynieDB();
