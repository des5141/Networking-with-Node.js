///SuperSocket_createBuffer(size);
var buffer = buffer_create(argument0+2, buffer_grow, 1);
buffer_write(buffer, buffer_u16, 0);// buffer size
return buffer;
