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
