import path from 'path';
import fs from 'fs';
import { IPynieDB, IConnectOptions } from './types/PynieDB';

import Model from './model';

class PynieDB implements IPynieDB {
	fullPath: string = '';

	connect (dbName: string, options: IConnectOptions) {
		let dbPath: string = '';
		let fullPath: string = '';

		if (options.path.includes('/')) {
			let pathArray = options.path.split('/');
			if (pathArray[0] === '' && pathArray[pathArray.length - 1] === '') dbPath = `${__dirname}${options.path}`;
			if (pathArray[0] === '' && pathArray[pathArray.length - 1] !== '') dbPath = `${__dirname}${options.path}/`;
			if (pathArray[0] !== '' && pathArray[pathArray.length - 1] === '') dbPath = `${__dirname}/${options.path}`;
			if (pathArray[0] !== '' && pathArray[pathArray.length - 1] !== '') dbPath = `${__dirname}/${options.path}/`;
		}
		else dbPath = `${__dirname}/${options.path}/${dbName}`;

		fullPath = path.normalize(dbPath);
		this.fullPath = `${fullPath}${dbName}`;

		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath);
			fs.mkdirSync(`${fullPath}${dbName}`);
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
