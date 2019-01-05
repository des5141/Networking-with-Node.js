///nn_send_message(msg)
{
    buffer_write(argument0, buffer_text, "§");
    buffer_write(argument0, buffer_u16, buffer_tell(argument0));
    global.check_bytes_send += buffer_tell(argument0);  
    network_send_raw(sys_nn.client, argument0, buffer_tell(argument0));
}
