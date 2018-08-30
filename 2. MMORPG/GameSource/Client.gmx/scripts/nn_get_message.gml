///nn_get_message()
{
    return ds_queue_dequeue(sys_nn.inbox);
}
