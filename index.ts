import PynieDB from './src/index';

const pyniedb = new PynieDB();

pyniedb.connect('test', {
	path: '/database/'
});
