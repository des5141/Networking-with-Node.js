///TC_textdraw()
global.TC_check+=(global.TC_speed/room_speed);
global.TC_check = clamp(global.TC_check,0,string_length(global.TC_text));

if global.TC_type = true
{
var __w__ = 0;
var __h__ = 0;
for(i=0;i<floor(global.TC_check);i++)
 {
 var char = string_char_at(global.TC_text,i+1);
 if (char == "#")
 {
  string_delete(global.TC_text,i+1,1);
  __w__ = 0;
  __h__ += string_height(char);
 }
 var Tc;
 if global.TC_choices != 0
 {
 Tc = 18;
 }
 else
 {
 Tc = 0;
 }
  if global.TC_shake = false
  {
  draw_set_colour(global.TC_color);
  draw_text(Tc+5+__w__ + view_xview[0] + 30,view_yview[0] + 320+__h__,char)
  draw_set_color(c_white);
  }
  else
  {
  draw_set_colour(global.TC_color);
  draw_text(Tc+5+__w__+random_range(-1,1)+ view_xview[0] + 30,view_yview[0] + 320+__h__+random_range(-1,1),char)
  draw_set_color(c_white);
  }
  __w__ += string_width(char);
 }
}
if global.TC_choose = true
{
 draw_set_alpha(1);
 draw_set_color(c_red);
 draw_triangle(view_xview[0] + 30+4,view_yview[0] + 320+6+global.TC_choice,view_xview[0] + 30+4,view_yview[0] + 320+14+global.TC_choice,view_xview[0] + 30+12,view_yview[0] + 320+10+global.TC_choice,false);
 draw_set_color(c_white);
 draw_set_alpha(1);
 if keyboard_check_pressed(vk_up)
 {
  if global.TC_choice > 0
  {
   global.TC_choice-=20
  }
 }
 if keyboard_check_pressed(vk_down)
 {
  if global.TC_choice < global.TC_choices*16
  {
   global.TC_choice+=20
  }
 }
}
if global.TC_spr_show = true
{
 draw_sprite(global.TC_spr,global.TC_index,global.TC_spr_x,global.TC_spr_y);
}
if global.TC_name != ""
{
 draw_text(view_xview[0] + 30,view_yview[0] + 290,global.TC_name);
}
