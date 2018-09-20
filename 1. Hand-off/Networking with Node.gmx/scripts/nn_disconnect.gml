///nn_disconnect()
if(instance_exists(sys_nn))
{
    network_destroy(sys_nn.client);
    
    //Kill the controller
    with (sys_nn) {
        instance_destroy();
    }
}
