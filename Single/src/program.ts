import { Server, IOSocket } from './Core/server';
import { user, userList } from './Prefab/user';
import { room, roomList } from './Prefab/room';

const io = new Server();
const authenticatedUsers = new userList();
const gameRooms = new roomList();

// 룸 들 확인
const tempRoom = new room();
gameRooms.addRoom(tempRoom);
console.log('# ROOMS : ', gameRooms.rooms);

io.onConnection((is: IOSocket) => {
    console.log('IOSocket connected');
    let mine: user = new user(is);
    // 승인된 유저 리스트에 추가
    authenticatedUsers.addUser(mine);
    console.log('# USERS : ', authenticatedUsers.users);

    is.onMessage((data: any) => {
        // 데이터를 받는 부분
        console.log(data);
        is.emit('rece', 'world of the warcraft');

        // 룸에 들어가고, 나오는 방법
        console.log(mine);
        tempRoom.addUser(mine);
        console.log(tempRoom.users);
        tempRoom.removeUser(mine);
        console.log(mine);
    });

    is.onClose(() => {
        console.log('IOSocket closed');
        authenticatedUsers.removeUser(mine);
    });
});

io.listen(5005);
