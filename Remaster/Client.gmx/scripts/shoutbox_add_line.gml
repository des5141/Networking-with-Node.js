///shoutbox_add_line(msg,col)
{
    with (obj_console) {
        to_add = string_replace_all(argument0, "#", "\#");
        to_add_col = argument1;
        event_user(0);
    }
}
