var uuid_v4 = require('uuid-v4');

function create(name, socket) {
	//Interface
	return {
		uuid: uuid_v4(), //UUID
		name: name, //User name
		socket: socket //User's socket
	};
}

module.exports.create = create;