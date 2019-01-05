///nn_status()
    if (current_time - ping > global.out_ping)
    {
        ping = current_time;
        nn_disconnect();
        return NN.status_disconnected;
    }
    if (instance_exists(sys_nn)) {
        return sys_nn.status;
    }
    else {
        return NN.status_disconnected;
    }
