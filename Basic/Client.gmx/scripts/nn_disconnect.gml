///nn_disconnect()
{
    with(sys_nn) {
        network_destroy(client);
        instance_destroy();
    }
}
