///shoutbox_add_line_spacer()
{
    with (obj_console) {
        if (!ds_list_empty(lines)) {
            shoutbox_add_line("", c_black);
        }
    }
}
