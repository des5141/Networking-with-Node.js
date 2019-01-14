'use strict';
// #region Init
var queue = require('./classes/Queue.js');
var readline = require('readline');
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
colors.setTheme({
    Emphasis: ['red', 'underline'],
    Okay: ['green', 'underline']
});
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.setPrompt(" >> ");
function send_raw(sock, write) {
    if (sock != -1) {
        buffer_write(write, buffer_string, "§");
        buffer_write(write, buffer_u16, write.offset);
        sock.send(write.buffer);
    }
}
// #endregion

// #region setting
var ip = '127.0.0.1';
var port = 65535;
// #endregion

// #region signal
const signal_login = 0;
const signal_login_refused = 1;
const signal_login_accepted = 2;
const signal_ping = 3;
// #endregion

// #region console mode
console_mode();
process.stdin.on('keypress', (str, key) => {
    //console.log(key);
    if (key.ctrl == true) {
        switch (key.name) {
            case 'q':
                mode = 1;
                console_mode();
                break;

            case 'w':
                mode = 0;
                console_mode();
                break;
        }
    }
});
function console_mode() {
    switch (mode) {
        case 0:
            console.clear();
            console.log("Networking with Node.js Engine".inverse);
            break;

        case 1:
            console.clear();
            console.log("다음을 입력해주십시오");

            rl.prompt();
            rl.once("line", (data) => {
                console.log(data);
                mode = 0;
                console_mode();
            });
            break;
    }
}
// #endregion

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
            console.log("User out (" + (quitter.uuid) + ")");
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
                            console.log("New user logined : " + name);
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
                    var buffer = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
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
    }, 1);
}();

server.listen(port, ip);