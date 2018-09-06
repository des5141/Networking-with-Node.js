///send_operation(msg);

    //Construct message
    var json_data = ds_map_create();
    ds_map_add(json_data, "id", NN.outsig_user_operation);
    ds_map_add(json_data, "msg", argument0);
    var body = json_encode(json_data);
    ds_map_destroy(json_data);
    
    //Send message
    nn_send_message(body);

