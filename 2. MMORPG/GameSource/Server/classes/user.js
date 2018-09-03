var uuid_v4 = require('uuid-v4');

function create(name, space, socket, uuid) {
	//Interface
	if(uuid == -1)
	{
		uuid = uuid_v4();
	}
	return {
		uuid: uuid, //UUID
		name: name, //User name
		socket: socket, //User's socket
		space: space, //User's space
		x: 3,
		y: 3,
		control: "none",
		mine: 0
	};
}

module.exports.create = create;