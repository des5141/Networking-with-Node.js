// * Class Definition
class user_list {
    // * Create Event
    constructor() {
        this.users = new Array();
    }

    // * Functions
    Add(user) {
        this.users[user.uuid] = user;
    }

    RemoveBySocket(dsocket) {
        delete this.users[dsocket.uuid];
    }

    RemoveByUUID(uuid) {
        delete this.users[uuid];
    }

    Find(uuid) {
        return this.users[uuid];
    }
    FindBySocket(socket) {
        for (uuid in this.users) 
            if (this.users[uuid].socket.uuid == socket.uuid) 
                return this.users[uuid];
    }

    Each(func) {
        for (uuid in this.users)
            func(this.users[uuid]);
    }
}

// * Module Exports
module.exports = user_list;