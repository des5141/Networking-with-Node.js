var uuid_v4 = require('uuid-v4');

function create(name, socket, id, uuid, space) {
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
		x: 0,
		y: 0,
		control: "none",
		mine: 0,
		id: id,
		xscale : 1,
		hp: 20,
		maxhp: 20,
		damage: 10,
		inventory: false
	};
}

module.exports.create = create;