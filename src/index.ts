import path from 'path';
import fs from 'fs';
import { IPynieDB, IConnectOptions } from './types/PynieDB';

import Model from './model';

class PynieDB implements IPynieDB {
	fullPath: string = '';

	connect (dbName: string, options: IConnectOptions) {
		let fullPath: string = '';

		fullPath = path.normalize(options.path);
		this.fullPath = `${fullPath}${dbName}`;

		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath);
			if (fs.existsSync(fullPath)) fs.mkdirSync(`${fullPath}${dbName}`);
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
