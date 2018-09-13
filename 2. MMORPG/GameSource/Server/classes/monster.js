var uuid_v4 = require('uuid-v4');

function create(type, space, x, y) {
	switch(type)
	{
		case 0:
			maxhp = 20;
			damage = 5;
			visual = 2.2;
			delay_time = 10;
		break;
		
		case 1:
			maxhp = 40;
			damage = 10;
			visual = 2.2;
			delay_time = 5;
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
		visual: visual,
		xscale: 1,
		uuid: uuid_v4(),
		active: 0,
		delay_time : delay_time,
		delay : 0
	};
}

module.exports.create = create;