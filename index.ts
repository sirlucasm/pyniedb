import PynieDB from './src/index';
import Model from './src/model';

PynieDB.connect('test', {
	path: '/database/'
});

class User extends Model {
	name: string;
	constructor(name: string, model: string) {
		super(model);
		this.name = name;
	}

	print() {
		console.log(this.name);
	}
}

const user = PynieDB.Model('User');

// user
// 	.create({
// 		name: 'Lucas'
// 	})
// 		.then((res) => {console.log(res)})
// 		.catch(error => console.log(error))

user.find('id', 3)
	.then((res) => {console.log(res)})
	.catch((error) => console.log(error.code))
