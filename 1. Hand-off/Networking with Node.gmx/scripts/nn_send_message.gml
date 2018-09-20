///nn_send_message(msg)
if(instance_exists(sys_nn))
{
    var bf = buffer_create(128, buffer_grow, 1);
    buffer_write(bf, buffer_string, argument0 + "#");
    network_send_raw(sys_nn.client, bf, buffer_tell(bf)-1);
    buffer_delete(bf);
}
