import uuidv4 from 'uuidv4';
import io from 'socket.io';
import { IOSocket } from '../Core/server';

// Events
function userError(user: user, err: any) {
    console.log(err);
}

// Classes
class user {
    uuid: string = uuidv4();
    iosocket: IOSocket;
    room: any = -1;

    constructor(iosocket: IOSocket) {
        this.iosocket = iosocket;
        this.iosocket.socket.on('error', (err: any) => {
            userError(this, err);
        });
    }
}

class userList {
    users: any = [];

    addUser(user: user) {
        this.users[user.uuid] = user;
    }

    removeUser(user: user) {
        delete this.users[user.uuid];
    }

    findUser(uuid: string) {
        return this.users[uuid];
    }

    findUserBySocket(iosocket: IOSocket) {
        for (var uuid in this.users) {
            if (this.users[uuid].iosocket === iosocket) {
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

export { user, userList, userError };
