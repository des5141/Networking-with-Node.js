///nn_get_message()
if(instance_exists(sys_nn))
{
    return ds_queue_dequeue(sys_nn.inbox);
}
