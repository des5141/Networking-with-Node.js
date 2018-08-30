var uuid_v4 = require('uuid-v4');

function create(name, space, socket) {
	//Interface
	return {
		uuid: uuid_v4(), //UUID
		name: name, //User name
		socket: socket, //User's socket
		space: space, //User's space
		x: 3,
		y: 3,
		control: "none"
	};
}

module.exports.create = create;