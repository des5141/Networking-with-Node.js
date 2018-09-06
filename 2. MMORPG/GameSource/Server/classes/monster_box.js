function create() {
	var Monsters = new Array(); //Internal list of Monsters

	//Add a Monster
	function addMonster(monster) {
		Monsters[monster.uuid] = monster;
	}
	
	//Remove a Monster
	function removeMonster(uuid) {
		delete Monsters[uuid];
	}
	
	//Find a Monster by UUID
	function findMonster(uuid) {
		return Monsters[uuid];
	}
	
	//Find a Monster by type
	function findMonsterByType(type) {
		for (uuid in Monsters) {
			if (Monsters[uuid].type == type) {
				return Monsters[uuid];
			}
		}
	}
	
	//Find a Monster by space
	function findMonsterBySpace(space) {
		for (uuid in Monsters) {
			if (Monsters[uuid].space == space) {
				return Monsters[uuid];
			}
		}
	}
	
	//Utility function for iterating through Monsters
	function each(f) {
		for (uuid in Monsters) {
			f(Monsters[uuid]);
		}
	}
	
	//Interface
	return {
		Monsters: Monsters,
		addMonster: addMonster,
		removeMonster: removeMonster,
		findMonster: findMonster,
		findMonsterByType: findMonsterByType,
		findMonsterBySpace: findMonsterBySpace,
		each: each
	};
}

module.exports.create = create;