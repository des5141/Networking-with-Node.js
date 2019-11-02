/**
User class.
*/

var uuid_v4 = require('uuid-v4');

function create(name, socket, id) {
	//Interface
	return {
		uuid: uuid_v4(), //UUID
		name: name, //User name
		id: id, // User ID
		socket: socket, //User's socket
		space: 0
	};
}

module.exports.create = create;