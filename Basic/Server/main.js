// #region server setup
    // #region Class
    class Queue {
        constructor() {
            this._arr = [];
        }
        enqueue(item) {
            this._arr.push(item);
        }
        dequeue() {
            return this._arr.shift();
        }
        length() {
            return this._arr.length;
        }
        destroy(message) {
            if (this._arr.indexOf(message) != -1) {
                this._arr.splice(this._arr.indexOf(message), 1);
            }
        }
    }
    // #endregion

    // #region Init
    var ip = '127.0.0.1';
    var port = 65535;
    var User = require('./classes/user.js');
    var UserBox = require('./classes/user_box.js');
    var authenticated_users = UserBox.create();
    var server = require('./classes/server.js').createServer();
    var buffer_temp = -1;
    var message_processing = new Queue();
    var message_socket = new Queue();
    // #endregion

    // #region Buffer
        // #region init
        const buffer_u8 = 0;
        const buffer_s8 = 1;
        const buffer_u16 = 2;
        const buffer_s16 = 3;
        const buffer_u32 = 4;
        const buffer_s32 = 5;
        const buffer_string = 6;
        // #endregion

        // #region Function
        function buffer_read(buffer, type, read) {
            switch (type) {
                case buffer_u8:
                    read.offset++;
                    return buffer.readUInt8(read.offset - 1);

                case buffer_s8:
                    read.offset++;
                    return buffer.readInt8(read.offset - 1);

                case buffer_u16:
                    read.offset += 2;
                    return buffer.readUInt16LE(read.offset - 2);

                case buffer_s16:
                    read.offset += 2;
                    return buffer.readInt16LE(read.offset - 2);

                case buffer_u32:
                    read.offset += 4;
                    return buffer.readUInt32LE(read.offset - 4);

                case buffer_s32:
                    read.offset += 4;
                    return buffer.readInt132LE(read.offset - 4);

                case buffer_string:
                    var length = buffer_read(buffer, buffer_u16, read);
                    read.offset += length + 1;
                    return buffer.toString('utf-8', read.offset - length - 1, read.offset - 1);
            }
        }
        function buffer_write(write, type, value) {
            switch (type) {
                case buffer_u8:
                    if (write.offset + 1 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset++;
                    (write.buffer).writeUInt8(value, write.offset - 1);
                    break;

                case buffer_s8:
                    if (write.offset + 1 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset++;
                    (write.buffer).writeInt8(value, write.offset - 1);
                    break;

                case buffer_u16:
                    if (write.offset + 2 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset += 2;
                    (write.buffer).writeUInt16LE(value, write.offset - 2);
                    break;

                case buffer_s16:
                    if (write.offset + 2 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset += 2;
                    (write.buffer).writeInt16LE(value, write.offset - 2);
                    break;

                case buffer_u32:
                    if (write.offset + 4 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset += 4;
                    (write.buffer).writeUInt32LE(value, write.offset - 4);
                    break;

                case buffer_s32:
                    if (write.offset + 4 > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset += 4;
                    (write.buffer).writeInt32LE(value, write.offset - 4);
                    break;

                case buffer_string:
                    value = value + '\0';
                    var length = Buffer.byteLength(value); // 개행문자를 추가한 길이
                    //buffer_write(write, buffer_u16, length);
                    if (write.offset + length > (write.buffer).length) {
                        var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                        (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                        (write.buffer) = Buffer.allocUnsafe((write.buffer).length + length).fill(0);
                        temp.copy((write.buffer), 0, 0, temp.length);
                    }
                    write.offset += length;
                    (write.buffer).write(value, write.offset - length, write.offset);
                    break;
            }
}
        function buffer_create(write) {
            write = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
        }
        // #endregion
    // #endregion

    // #region Network
        // #region Signal
        const signal_login = 0;
        const signal_login_refused = 1;
        const signal_login_accepted = 2;
        const signal_ping = 3;
        // #endregion

        // #region Function
        function send_raw(sock, write) {
            if (sock != -1) {
                buffer_write(write, buffer_string, "§");
                buffer_write(write, buffer_u16, write.offset);
                sock.send(write.buffer);
            }
        }
        // #endregion
    // #endregion
// #endregion

server.onConnection(function (dsocket) {
    // #region 클라이언트 메세지 분석 후 큐에 삽입
    dsocket.onMessage(function (data) {
        try {
            if (buffer_temp == -1) {
                buffer_temp = Buffer.allocUnsafe(data.length).fill(0);
                data.copy(buffer_temp, 0, 0, data.length);
            } else {
                buffer_temp = Buffer.concat([buffer_temp, data], data.length + buffer_temp.length);
            }
            var index = 0;
            while (true) {
                if (buffer_temp.toString('utf-8', index - 4, index - 2) == "§") {
                    var length = buffer_temp.readUInt16LE(index - 2) - 2;
                    message_processing.enqueue(buffer_temp.slice(index - 4 - length, index - 4));
                    message_socket.enqueue(dsocket);
                    buffer_temp = buffer_temp.slice(index, buffer_temp.length);
                    index = 0;
                    continue;
                }
                if (index >= buffer_temp.length) {
                    break;
                }
                index++;
            }
        } catch (e) {
            console.log("- pid ".red + process.pid + "에서 에러 발생 | ".red + e);
        }
    });
    // #endregion
    // #region 클라이언트와의 연결이 끊겼을때
    dsocket.onClose(function () {
        var quitter;
        if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
            console.log("- 유저 나감 (".gray + (quitter.uuid).gray + ")".gray);
            process.send({ type: 'logout', to: 'master', uuid: quitter.uuid });
            authenticated_users.removeUserData(quitter.uuid);
        }
    });
    // #endregion
});

!function processing() {
    try {
        while (message_processing.length() != 0) {
            // #region setting
            var dsocket = message_socket.dequeue();
            var data = message_processing.dequeue();
            var signal = -1;
            var read = { offset: 0 };
            var ins = authenticated_users.findUserBySocket(dsocket);
            signal = buffer_read(data, buffer_u8, read);
            // #endregion

            if (ins == null) {
                // #region Not authenticated users
                switch (signal) {
                    case signal_login:
                        // #region codes
                        var name = buffer_read(data, buffer_string, read);
                        if (authenticated_users.findUserByName(name) != null) {
                            // refused
                            var buffer = buffer_create();
                            buffer_write(buffer, buffer_u8, signal_login_refused);
                            send_raw(dsocket, buffer);
                        } else {
                            // accepted
                            var new_user = User.create(dsocket, name, 0);
                            authenticated_users.addUser(new_user);
                            console.log("New user logined : " + name);
                            var buffer = buffer_create();
                            buffer_write(buffer, buffer_u8, signal_login_accepted);
                            send_raw(dsocket, buffer);
                        }
                        // #endregion
                        break;
                }
                // #endregion
            } else {
                // #region authenticated users
                switch (signal) {

                }
                // #endregion
            }

            // common
            switch (signal) {
                case signal_ping:
                    // #region codes
                    var buffer = buffer_create();
                    buffer_write(buffer, buffer_u8, signal_ping);
                    send_raw(dsocket, buffer);
                    // #endregion
                    break;
            }
        }
    } catch (e) {
        console.log(e);
    }
    setTimeout(function () {
        processing();
    }, 10);
}();

server.listen(port, ip);