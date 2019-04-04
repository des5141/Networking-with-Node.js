///js_status();
if(js_isConnected() == -1) {
    global.master_instance = -1;
    js_reconnect();
    room_goto(rm_connect);
}
if(js_isConnected() == 1)and(room != rm_main) {
    room_goto(rm_main);
}
