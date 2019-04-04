///SuperSocket_write(buffer, buffer_type, value);
if(argument1 == buffer_string){
    buffer_write(argument0, buffer_u16, string_byte_length(argument2));
    buffer_write(argument0, buffer_text, argument2);
}else {
    // Common
    buffer_write(argument0, argument1, argument2);
}
