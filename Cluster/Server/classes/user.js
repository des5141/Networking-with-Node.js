var uuid_v4 = require('uuid-v4');
function create(socket, name, space) {
    //Interface
    return {
        uuid: uuid_v4(), //UUID
        name: name, //User name
        socket: socket, //User's socket
        space: space //User's space
    };
}
module.exports.create = create;