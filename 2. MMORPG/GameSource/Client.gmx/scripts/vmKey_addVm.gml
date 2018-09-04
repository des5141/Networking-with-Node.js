///vmKey_addVm();

var VM, i;
VM = ds_list_create();

for(i=0;i<32;i+=1){
var indVM;
indVM = ds_map_create();
ds_map_add(indVM,"KeyCode",0);
ds_list_add(VM,indVM);
}

ds_list_add(_vmKeyIndexList_,VM);
return(ds_list_size(_vmKeyIndexList_)-1);
