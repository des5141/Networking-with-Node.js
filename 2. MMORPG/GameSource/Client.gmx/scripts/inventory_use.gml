switch(item[argument0])
{
    case 1:
        global.weapon = 1;
        break;
        
    default:
        break;
}

global.msg[0] = item_name(item[argument0]) + " 아이템을 사용하였습니다/%"
global.msg[1] = ""
instance_create(0, 0, obj_dialoguer)
