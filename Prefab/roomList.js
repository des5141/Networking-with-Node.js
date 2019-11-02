// * Class Definition
class roomList {
  // * Create Event
  constructor () {
    this.rooms = [];
  }

  // * Functions
  Add (room) {
    this.rooms[room.id] = room;
  }

  RemoveByID (id) {
    delete this.rooms[id];
  }

  Find (id) {
    return this.rooms[id];
  }

  Each (func) {
    for (var id in this.rooms) { func(this.rooms[id]); }
  }
}

// * Module Exports
module.exports = roomList;
