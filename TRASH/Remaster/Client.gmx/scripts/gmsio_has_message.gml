///gmsio_has_message()
{
    return !ds_queue_empty(__cobj_gmsio__.inbox);
}
