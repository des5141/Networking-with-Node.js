///nn_status()
    if (current_time - my_ping[1] > global.out_ping)
    {
        nn_disconnect();
        return NN.status_disconnected;
    }
    if (instance_exists(sys_nn)) {
        return sys_nn.status;
    }
    else {
        return NN.status_disconnected;
    }
