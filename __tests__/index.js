const { default: pyniedb } = require('../lib/index');

pyniedb.connect('test', {
	path: `${__dirname}/database/`
});

module.exports = pyniedb;
