///SuperSocket_createBuffer(size);
var buffer = buffer_create(argument0+4, buffer_grow, 1);
buffer_write(buffer, buffer_u32, 0);// buffer size
return buffer;
