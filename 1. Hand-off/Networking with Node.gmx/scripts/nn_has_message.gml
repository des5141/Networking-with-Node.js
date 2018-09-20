///nn_has_message()
if(instance_exists(sys_nn))
{
    return !ds_queue_empty(sys_nn.inbox);
}
