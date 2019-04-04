///SuperSocket_createBuffer(Type, SendTo, Space);
var buffer = buffer_create(1024, buffer_grow, 1);
buffer_write(buffer, buffer_u16, 0);         // buffer size
buffer_write(buffer, buffer_u16, argument1); // sendTo
buffer_write(buffer, buffer_s16, argument2); // space
buffer_write(buffer, buffer_s16, argument0); // signal
return buffer;
