//Construct message
var json_data = ds_map_create();
ds_map_add(json_data, "id", NN.outsig_user_inventory);
ds_map_add(json_data, "msg", argument0);
ds_map_add(json_data, "type", "drop" );
var body = json_encode(json_data);
ds_map_destroy(json_data);

//Send message
nn_send_message(body);

var msg;
msg[0] = item_name(item[argument0]) + " \0아이템을 버렸습니다"
dialogue_create(msg, "none");
