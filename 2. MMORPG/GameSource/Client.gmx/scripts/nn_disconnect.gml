///nn_disconnect()
{
    network_destroy(sys_nn.client);
    
    //Kill the controller
    with (sys_nn) {
        instance_destroy();
    }
}
