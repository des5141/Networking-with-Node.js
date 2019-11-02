// * Class Definition
class userList {
  // * Create Event
  constructor () {
    this.users = [];
  }

  // * Functions
  Add (user) {
    this.users[user.id] = user;
  }

  RemoveByID (id) {
    delete this.users[id];
  }

  Find (id) {
    return this.users[id];
  }

  Each (func) {
    for (var id in this.users) { func(this.users[id]); }
  }
}

// * Module Exports
module.exports = userList;
