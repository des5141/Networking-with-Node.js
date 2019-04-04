///js_status()
var timeout = current_time - ping[0];
if(timeout > global.timeout) {
    js_disconnect();
}
if(js_isConnected() == -1) {
    global.login = false;
    global.master_instance = -1;
    js_reconnect();
    room_goto(rm_connect);
}
if(js_isConnected() == 1) {
    if(room != rm_login)and(global.login == false) {
        room_goto(rm_login);
    }
}
