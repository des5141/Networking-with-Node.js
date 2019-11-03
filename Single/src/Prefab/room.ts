import uuidv4 from 'uuidv4';
import { user } from './user';
import io from 'socket.io';

class room {
    users: any = [];
    uuid: string = uuidv4();

    addUser(user: user) {
        this.users[user.uuid] = user;
        user.room = this;
    }

    removeUser(user: user) {
        user.room = -1;
        delete this.users[user.uuid];
    }

    findUser(uuid: string) {
        return this.users[uuid];
    }

    findUserBySocket(socket: io.Socket) {
        for (var uuid in this.users) {
            if (this.users[uuid].socket === socket) {
                return this.users[uuid];
            }
        }
    }

    each(func: Function) {
        for (var uuid in this.users) {
            func(this.users[uuid]);
        }
    }
}

class roomList {
    rooms: any = [];

    addRoom(room: room) {
        this.rooms[room.uuid] = room;
    }

    removeRoom(uuid: string) {
        delete this.rooms[uuid];
    }

    findRoom(uuid: string) {
        return this.rooms[uuid];
    }

    each(func: Function) {
        for (var uuid in this.rooms) {
            func(this.rooms[uuid]);
        }
    }
}

export { room, roomList };
