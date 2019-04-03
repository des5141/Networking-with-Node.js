'use strict';
var User = require('./classes/user.js');
var UserBox = require('./classes/user_box.js');
var authenticated_users = UserBox.create();
var server = require('./classes/server.js').createServer();
var colors = require('colors');
var buffer_read = require('./classes/buffer.js').buffer_read;
var buffer_write = require('./classes/buffer.js').buffer_write;
var buffer_u8 = 0;
var buffer_s8 = 1;
var buffer_u16 = 2;
var buffer_s16 = 3;
var buffer_u32 = 4;
var buffer_s32 = 5;
var buffer_string = 6;
var buffer_temp = -1;
var mode = 0;
var message_processing = new queue();
var message_socket = new queue();
var server_log_queue = new queue();
colors.setTheme({
    Emphasis: ['red', 'underline'],
    Okay: ['green', 'underline']
});
function send_raw(sock, write) {
    if (sock != -1) {
        buffer_write(write, buffer_string, "§");
        buffer_write(write, buffer_u16, write.offset);
        sock.send(write.buffer);
    }
}
function server_log(message) {
    server_log_queue.enqueue(message);
    if (mode == 1) {
        console.log(message);
    }
}
// #endregion

var ip = '127.0.0.1';
var port = 65535;

const signal_login = 0;
const signal_login_refused = 1;
const signal_login_accepted = 2;
const signal_ping = 3;


/// Connection
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
            console.log(e);
        }
    });
    // #endregion
    // #region 클라이언트와의 연결이 끊겼을때
    dsocket.onClose(function () {
        var quitter;
        if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
            server_log("Client disconnected ".gray + (quitter.uuid).white);
            authenticated_users.removeUser(quitter.uuid);
        }
    });
    // #endregion
});

// Message processing
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

            // Not common
            if (ins == null) {
                // #region Not authenticated users
                switch (signal) {
                    case signal_login:
                        // #region codes
                        var name = buffer_read(data, buffer_string, read);
                        if (authenticated_users.findUserByName(name) != null) {
                            // refused
                            var buffer = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
                            buffer_write(buffer, buffer_u8, signal_login_refused);
                            send_raw(dsocket, buffer);
                        } else {
                            // accepted
                            var new_user = User.create(dsocket, name, 0);
                            authenticated_users.addUser(new_user);
                            server_log("New user logined : ".gray + (new_user.uuid).white);
                            var buffer = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
                            buffer_write(buffer, buffer_u8, signal_login_accepted);
                            buffer_write(buffer, buffer_string, new_user.uuid);
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
                    for (var i = 0; i < 100; i++) {
                        var buffer = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
                        buffer_write(buffer, buffer_u8, signal_ping);
                        buffer_write(buffer, buffer_s8, i);
                        buffer_write(buffer, buffer_s32, -1);
                        buffer_write(buffer, buffer_string, "sex");
                        buffer_write(buffer, buffer_string, "asd");
                        buffer_write(buffer, buffer_string, "qweqweqwe");
                        buffer_write(buffer, buffer_s8, -50);
                        buffer_write(buffer, buffer_string, "loli ZOA!!!!!");
                        send_raw(dsocket, buffer);
                    }
                    // #endregion
                    break;
            }
        }
    } catch (e) {
        console.log(e);
    }
    setTimeout(function () {
        processing();
    }, 1);
}();

server.listen(port, ip);