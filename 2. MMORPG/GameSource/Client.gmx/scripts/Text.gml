///Text(str,spd,shake,key,assort)
var str_ = argument[0];
var spd = argument[1];
var shake = argument[2];
var key = argument[3];
var assort = argument[4];
if global.TC_key == key && global.TC_assort = assort
{
global.TC_choice = 0;
global.TC_choose = false;
global.TC_choices = 0;
global.TC_text = str_;
global.TC_speed = spd;
global.TC_type = true;
global.TC_shake = shake;
if alarm[0] = -1
{
global.TC_check = 0;
alarm[0] = string_length(global.TC_text)*(room_speed/global.TC_speed);
}
else
{
global.TC_check = string_length(global.TC_text);
alarm[0] = 1;
}
}
