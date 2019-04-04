///nn_disconnect()
{
    with(obj_network) {
        ping = current_time;
        my_ping[0] = current_time;
        my_ping[1] = current_time;
    }
    with(sys_nn) {
        network_destroy(client);
        instance_destroy();
    }
}
