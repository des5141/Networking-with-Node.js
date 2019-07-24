// * Function Definition
function create(socket) {
    return {
        uuid: socket.uuid,
        socket: socket
    };
}

// * Module Exports
module.exports = create;