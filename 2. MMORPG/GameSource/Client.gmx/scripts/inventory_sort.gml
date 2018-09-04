with(obj_inventory)
{
    var i;
    for(i = 0; i < 9; i++)
    {
        if(item[i] = 0)and(item[i+1] != 0)
        {
            item[i] = item[i+1];
            item[i+1] = 0;
        }   
    }
}
