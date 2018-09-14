///Image(spr,index,x,y,key,assort)
var spr = argument[0];
var ind_ = argument[1];
var xx = argument[2];
var yy = argument[3];
var key = argument[4];
var assort = argument[5];
if global.TC_key == key && global.TC_assort == assort
{
 global.TC_spr_show = true;
 global.TC_spr = spr;
 global.TC_index = ind_;
 global.TC_spr_x = xx;
 global.TC_spr_y = yy;
}
