///gmsio_get_message()
{
    return ds_queue_dequeue(__cobj_gmsio__.inbox);
}
