///vmKey_getMouseIn(x1,y1,x2,y2)
return (argument0<argument2 && argument1<argument3 && argument0<device_mouse_x_to_gui(argument4) && device_mouse_x_to_gui(argument4)<argument2 && argument1<device_mouse_y_to_gui(argument4) && device_mouse_y_to_gui(argument4)<argument3)
|| (argument0>argument2 && argument1<argument3 && argument0>device_mouse_x_to_gui(argument4) && device_mouse_x_to_gui(argument4)>argument2 && argument1<device_mouse_y_to_gui(argument4) && device_mouse_y_to_gui(argument4)<argument3)
|| (argument0<argument2 && argument1>argument3 && argument0<device_mouse_x_to_gui(argument4) && device_mouse_x_to_gui(argument4)<argument2 && argument1>device_mouse_y_to_gui(argument4) && device_mouse_y_to_gui(argument4)>argument3)
|| (argument0>argument2 && argument1>argument3 && argument0>device_mouse_x_to_gui(argument4) && device_mouse_x_to_gui(argument4)>argument2 && argument1>device_mouse_y_to_gui(argument4) && device_mouse_y_to_gui(argument4)>argument3);

