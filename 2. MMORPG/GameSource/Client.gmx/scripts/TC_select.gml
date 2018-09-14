///TC_select(key,assort,as1,as2,as3)
var num = argument[0];
var key = argument[1];
var assort = argument[2];
var as1 = argument[3];
var as2 = argument[4];
var as3 = argument[5];
if global.TC_key = key && global.TC_assort = assort
{
 DoSelected(0,as1,key,assort)
 DoSelected(1,as2,key,assort)
 if as3 != false
 {
 DoSelected(2,as3,key,assort)
 }
}
