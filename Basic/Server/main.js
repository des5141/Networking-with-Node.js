// TODO: Loading Modules
let server = new (require('./Classes/Networking_with_NodeJS'))();
let BM = new server.buffer_manager(); // Buffer Manager
let signal = new server.signal(); // Signal Variables
let user_prefab = server.user; // User Prefab
let user_list = new server.user_list(); // User List

// * Server Create Event
server.Emitter.on('start', ()=>{
    console.log(`Server Started`);
});

// * Networking Event
server.onSomething((dsocket)=>{
    // New Connection
    var new_user = user_prefab(dsocket);
    user_list.Add(new_user);
    console.log(`New Connection Received, UUID : ${new_user.uuid}`);

    // Data In Comming
    dsocket.onMessage((data)=>{
        var buffer = BM.load(data);
        console.log(BM.read(buffer, BM.u16));
        console.log(BM.read(buffer, BM.s16));
        console.log(BM.read(buffer, BM.s16));
        console.log(BM.read(buffer, BM.string));
        console.log(BM.read(buffer, BM.s16));
    });

    // Socket Error
    dsocket.onError(()=>{
        user_list.RemoveBySocket(dsocket);
        console.log("error");
    });

    // Socket End
    dsocket.onClose(()=>{
        user_list.RemoveBySocket(dsocket);
        console.log("closed");
    });
});

// * Server Boot
server.listen("any", 65535);