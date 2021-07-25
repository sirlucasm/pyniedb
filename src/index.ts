import path from 'path';
import fs from 'fs';
import { IPynieDB, IConnectOptions } from './types/PynieDB';

class PynieDB implements IPynieDB {
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

		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath, '0777');
			fs.mkdirSync(`${fullPath}${dbName}`, '0777');
			console.log(`\ndatabase '${dbName}' created\n`);
		}
	}
}

export default PynieDB;
