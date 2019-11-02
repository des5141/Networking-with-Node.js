/**
User container class.
*/

function create() {
	var users = new Array(); //Internal list of users

	//Add a user
	function addUser(user) {
		users[user.uuid] = user;
	}
	
	//Remove a user
	function removeUser(uuid) {
		delete users[uuid];
	}
	
	//Find a user by UUID
	function findUser(uuid) {
		return users[uuid];
	}
	
	//Find a user by name
	function findUserByName(name) {
		for (uuid in users) {
			if (users[uuid].name == name) {
				return users[uuid];
			}
		}
	}

	//Find a user by id
	function findUserById(id) {
		for (uuid in users) {
			if (users[uuid].id == id) {
				return users[uuid];
			}
		}
	}
	
	//Find a user by socket
	function findUserBySocket(socket) {
		for (uuid in users) {
			if (users[uuid].socket == socket) {
				return users[uuid];
			}
		}
	}

	//Change a user by space
	function ChangeUserSpace(socket, space) {
		for (uuid in users) {
			if (users[uuid].socket == socket) {
				users[uuid].space = space;
			}
		}
	}
	
	//Utility function for iterating through users
	function each(f) {
		for (uuid in users) {
			f(users[uuid]);
		}
	}
	
	//Interface
	return {
		users: users,
		addUser: addUser,
		removeUser: removeUser,
		findUser: findUser,
		findUserByName: findUserByName,
		findUserBySocket: findUserBySocket,
		findUserById: findUserById,
		ChangeUserSpace: ChangeUserSpace,
		each: each
	};
}

module.exports.create = create;