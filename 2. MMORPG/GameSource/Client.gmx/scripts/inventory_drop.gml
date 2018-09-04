global.msg[0] = item_name(item[argument0]) + " 아이템을 버렸습니다/%"
global.msg[1] = ""
        
instance_create(0, 0, obj_dialoguer)
item[argument0] = 0;
