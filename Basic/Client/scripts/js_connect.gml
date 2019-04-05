///js_connect(ip, port);
global.reconnect_ip = argument0;
global.reconnect_port = argument1;
global.connect_type = -1;
var ins = instance_create(0, 0, sys_network);

if (os_browser == browser_not_a_browser)
    global.connect_type = 1;
else
    global.connect_type = 2;
    
/// TCP
if (global.connect_type  == 1) {
    ins.status = 0; // connecting
    ins.socket = network_create_socket(network_socket_tcp);
    if(network_connect_raw(ins.socket, argument0, argument1) >= 0) {
        ins.status = 1; // connected!
        global.master_instance = id;
    }else {
        instance_destroy(ins);
    }
}


/// Socket.io
else if (global.connect_type == 2) {
    html5_connect(argument0, argument1);
    ins.status = 0; // connecting
}
