///AssortEnd(key,nextkey,assort)
var key = argument[0];
var nextkey = argument[1];
var assort = argument[2];
if global.TC_key == key && global.TC_assort == assort
{
 global.TC_assort = 0;
 global.TC_key=nextkey;
}
