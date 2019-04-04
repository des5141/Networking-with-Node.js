///js_checkMessage();
if (ds_queue_size(global.message_processing) != 0)
    return true;
else
    return false;
