/// js_sys_networking();
// * Processing Packet
if (global.connect_type == 1) { /// TCP
    if (ds_map_find_value(async_load, 'id') == socket) {
        if (ds_map_find_value(async_load, 'type') == network_type_data) {
            var buffer = ds_map_find_value(async_load, 'buffer');
            global.check_bytes_recv += buffer_get_size(buffer);
            
            if (global.message_buffer == -1) {
                global.message_buffer = buffer_create(1, buffer_grow, 1);
                buffer_copy(buffer, 0, buffer_get_size(buffer), global.message_buffer, 0);
            } else { buffer_copy(buffer, 0, buffer_get_size(buffer), global.message_buffer, buffer_get_size(global.message_buffer)); }
            
            var get_size = -1;
            while(true) {
                buffer_seek(global.message_buffer, buffer_seek_start, 0);
                get_size = buffer_get_size(global.message_buffer);
                if (get_size < 4)
                    break;
                    
                var buffer_length = buffer_read(global.message_buffer, buffer_u32) - 4;
                
                var temp_buffer = buffer_create(1, buffer_grow, 1);
                buffer_copy(global.message_buffer, buffer_tell(global.message_buffer), buffer_length, temp_buffer, 0);
                ds_queue_enqueue(global.message_processing, temp_buffer);
                
                var temp = buffer_create(1, buffer_grow, 1);
                buffer_copy(global.message_buffer, (buffer_length + 4), get_size - (buffer_length + 4), temp, 0);
                buffer_resize(global.message_buffer, 1);
                buffer_copy(temp, 0, buffer_get_size(temp), global.message_buffer, 0); 
                buffer_delete(temp);
                if(buffer_get_size(global.message_buffer) == 1) {
                    buffer_delete(global.message_buffer);
                    global.message_buffer = -1;
                    break;
                }
            }
            
            while (ds_queue_size(global.message_processing) != 0) {
                if  ( global.master_instance != -1 ) {
                    with(global.master_instance) {
                        recv_buffer = ds_queue_dequeue(global.message_processing);
                        if not(buffer_get_size(recv_buffer) == 1){
                            event_user(0); // Processing
                        }
                        buffer_delete(recv_buffer);
                    }
                }
            }
        }
    }
}
