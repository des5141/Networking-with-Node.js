var uuid_v4 = require('uuid-v4');

function create(type, space, x, y) {
	switch(type)
	{
		case 0:
			maxhp = 20;
			damage = 5;
		break;
		
		case 1:
			maxhp = 40;
			damage = 10;
		break;
		
		default:
			return -1;
		break;
	}
	
	hp = maxhp;
	
	return {
		type: type,
		space: space,
		x: x,
		y: y,
		hp: hp,
		maxhp: maxhp,
		damage: damage,
		uuid: uuid_v4()
	};
}

module.exports.create = create;