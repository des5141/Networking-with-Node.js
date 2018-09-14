///TextChoose(str1,str2,str3,spd,shake,key,assort)
var spd = argument[3];
var shake = argument[4];
var key = argument[5];
var assort = argument[6];
if global.TC_key == key && global.TC_assort = assort
{
global.TC_choice = 0;
global.TC_choose = true;
global.TC_text = "";
for(i=0;i<3;i++)
{
if argument[i] != false{
global.TC_text += +argument[i]+"#";
global.TC_choices=i;
}
}
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
