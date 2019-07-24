#define gmsio_status
///gmsio_status()
{
    if (instance_exists(__cobj_gmsio__)) {
        return __cobj_gmsio__.status;
    }
    else {
        return gmsio_status_disconnected;
    }
}

#define gmsio_connect
///gmsio_connect(host,port)
{
    //Create the controller
    var inst = instance_create(0, 0, __cobj_gmsio__);

    //Non-HTML5
    if (os_browser == browser_not_a_browser) {
        inst.client = network_create_socket(network_socket_tcp);
        if (network_connect_raw(inst.client, argument0, argument1) >= 0) {
            inst.status = gmsio_status_connected;
        }
        else {
            with (inst) {
                instance_destroy();
            }
        }
    }
    
    //HTML5
    else {
        __gmsio_html5_connect__(argument0, argument1);
        inst.status = gmsio_status_connecting;
        inst.client = -1;
    }
}

#define gmsio_disconnect
///gmsio_disconnect()
{
    //Non-HTML5
    if (os_browser == browser_not_a_browser) {
        network_destroy(__cobj_gmsio__.client);
    }
    
    //HTML5
    else {
        __gmsio_html5_disconnect__();
    }
    
    //Kill the controller
    with (__cobj_gmsio__) {
        instance_destroy();
    }
}

#define gmsio_send_message
///gmsio_send_message(msg)
{
    //Non-HTML5
    if (os_browser == browser_not_a_browser) {
        var bf = buffer_create(128, buffer_grow, 1);
        buffer_write(bf, buffer_string, argument0);
        network_send_raw(__cobj_gmsio__.client, bf, buffer_tell(bf)-1);
        buffer_delete(bf);
    }
    
    //HTML5
    else {
        __gmsio_html5_send_message__(argument0);
    }
}

#define gmsio_has_message
///gmsio_has_message()
{
    return !ds_queue_empty(__cobj_gmsio__.inbox);
}

#define gmsio_get_message
///gmsio_get_message()
{
    return ds_queue_dequeue(__cobj_gmsio__.inbox);
}

