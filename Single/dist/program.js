"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./Core/server");
var user_1 = require("./Prefab/user");
var room_1 = require("./Prefab/room");
var io = new server_1.Server();
var authenticatedUsers = new user_1.userList();
var gameRooms = new room_1.roomList();
// 룸 들 확인
var tempRoom = new room_1.room();
gameRooms.addRoom(tempRoom);
console.log('# ROOMS : ', gameRooms.rooms);
io.onConnection(function (is) {
    console.log('IOSocket connected');
    var mine = new user_1.user(is);
    // 승인된 유저 리스트에 추가
    authenticatedUsers.addUser(mine);
    console.log('# USERS : ', authenticatedUsers.users);
    is.onMessage(function (data) {
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
    is.onClose(function () {
        console.log('IOSocket closed');
        authenticatedUsers.removeUser(mine);
    });
});
io.listen(5005);
