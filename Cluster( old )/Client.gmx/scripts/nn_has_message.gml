///nn_has_message()
{
    return !ds_queue_empty(sys_nn.inbox);
}
