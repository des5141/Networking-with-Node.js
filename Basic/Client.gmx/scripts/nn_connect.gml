///nn_connect(host,port)
{
    //Create the controller
    var inst = instance_create(0, 0, sys_nn);

    inst.status = NN.status_connecting;
    inst.client = network_create_socket(network_socket_tcp);
    ping = current_time;
    if (network_connect_raw(inst.client, argument0, argument1) >= 0) {
        inst.status = NN.status_connected;
        ping = current_time;
        my_ping = current_time;
    }
    else {
        with (inst) {
            instance_destroy();
        }
    }
    
}
