// TODO: Loading Modules
const server = new (require('./Classes/Networking_with_NodeJS'))();
const BM = new server.buffer_manager(); // Buffer Manager
const signal = new server.signal(); // Signal Variables
const user_prefab = server.user; // User Prefab
const user_list = new server.user_list(); // User List

server.json_mode = true; // json mode 를 키게되면, socket.io 만 동작한다.

// * Server Create Event
server.Emitter.on('start', () => {
  console.log('Server Started');
});

// * Networking Event
server.onSomething((dsocket) => {
  // New Connection
  var new_user = user_prefab(dsocket);
  user_list.Add(new_user);
  console.log('New user comming');
  // Data In Comming
  dsocket.onMessage((data) => {
    /* var read_buffer = BM.load(data); // ! Data
    var get_index1 = BM.read(read_buffer, BM.u8);
    var get_index2 = BM.read(read_buffer, BM.u8); */

    // Return
    /* var write_buffer = BM.create(1024);
    BM.write(write_buffer, BM.u8, 5);
    BM.write(write_buffer, BM.u8, 6);
    dsocket.send(write_buffer);

    // Free
    // BM.free(read_buffer);
    BM.free(write_buffer); */
    console.log(data);
  });

  // Socket Error
  dsocket.onError(() => {
    user_list.RemoveBySocket(dsocket);
    console.log('error');
  });

  // Socket End
  dsocket.onClose(() => {
    user_list.RemoveBySocket(dsocket);
    console.log('closed');
  });
});

// * Server Boot
server.listen('any', 65535, 5005);
