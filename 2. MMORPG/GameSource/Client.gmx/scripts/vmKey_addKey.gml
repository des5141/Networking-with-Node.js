///vmKey_addKey(vmkey,ind,code)

if argument0>=ds_list_size(_vmKeyIndexList_) || argument1>32{
return false;
}
var VM;
VM = ds_list_find_value(ds_list_find_value(_vmKeyIndexList_,argument0),argument1);

ds_map_replace(VM,"KeyCode",argument2);
return true;
