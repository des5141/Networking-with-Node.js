//Construct message
var json_data = ds_map_create();
ds_map_add(json_data, "id", NN.outsig_user_inventory);
ds_map_add(json_data, "msg", argument0);
ds_map_add(json_data, "type", "drop" );
var body = json_encode(json_data);
ds_map_destroy(json_data);

//Send message
nn_send_message(body);

global.msg[0] = item_name(item[argument0]) + " 아이템을 버렸습니다/%"
global.msg[1] = ""
        
instance_create(0, 0, obj_dialoguer)
