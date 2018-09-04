 global.bgr1 = global.bgr2;
 global.bgg1 = global.bgg2;
 global.bgb1 = global.bgb2;
 global.bgr2 = color_get_red(argument0);
 global.bgg2 = color_get_green(argument0);
 global.bgb2 = color_get_blue(argument0);
 
 global.fgr1 = global.fgr2;
 global.fgg1 = global.fgg2;
 global.fgb1 = global.fgb2;
 global.fgr2 = color_get_red(argument1);
 global.fgg2 = color_get_green(argument1);
 global.fgb2 = color_get_blue(argument1);
 
 global.fadein = 0;
