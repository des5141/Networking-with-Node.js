/// js_sys_create();
only_single();
if(ds_exists(global.message_processing, ds_type_queue)) {
    ds_queue_destroy(global.message_processing);
    global.message_processing = ds_queue_create();
}
if(buffer_exists(global.message_buffer)) {
    buffer_delete(global.message_buffer);
    global.message_buffer = -1;
}
