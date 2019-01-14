'use strict';
// #region Init
var engine_version = "v1.0"
var cluster = require('cluster');
var queue = require('./classes/Queue.js');
var readline = require('readline');
var User = require('./classes/user.js');
var UserBox = require('./classes/user_box.js');
var authenticated_users = UserBox.create();
var server = require('./classes/server.js').createServer();
var colors = require('colors');
var os = require('os');
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

if (cluster.isMaster) {
    // #region init
    function server_log(message) {
        server_log_queue.enqueue(message);
        if (mode == 1) {
            console.log(message);
        }
    }
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt("");
    // #endregion

    // #region console mode
    console_mode();
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl == true) {
            switch (key.name) {
                case 'q':
                    mode = 0;
                    console_mode();
                    break;

                case 'w':
                    mode = 1;
                    console_mode();
                    break;

                case 'e':
                    mode = 2;
                    console_mode();
                    break;

                case 'r':
                    mode = 3;
                    console_mode();
                    break;
            }
        }
    });
    function console_mode() {
        console.clear();
        switch (mode) {
            case 0:
                console.log("Networking with Node.js - Networking Engine".inverse);
                console.log("※ 개발자 한마디".white);
                console.log(" 이 ".gray + "https://github.com/des5141/Networking-with-Node.js".white + "\n 레퍼지토리 README에 기본적인 사용법이 있습니다\n\n 다음을 통해 개발자에게 문의할 수 있습니다\n 개발자 블로그 : www.rhea31.blog.me\n".gray);
                console.log("※ 명령어".white);
                console.log(" 1)".gray + " ctrl+q ".white + "- 메인화면으로 돌아옵니다".gray);
                console.log(" 2)".gray + " ctrl+w ".white + "- 현재 게임 로그를 띄웁니다".gray);
                console.log(" 3)".gray + " ctrl+e ".white + "- 서버 정보를 보여줍니다".gray);
                console.log(" 4)".gray + " ctrl+r ".white + "- 게임 로그를 초기화합니다".gray);
                break;

            case 1:
                console.log("Game log".inverse);
                for (var i = 0; i < server_log_queue.length(); i++) {
                    console.log(server_log_queue.pick(i));
                }
                break;

            case 2:
                console.log("Server status".inverse);
                console.log("IP : ".gray + ip.white);
                console.log("PORT : ".gray + port);
                console.log("ENGINE VERSION : ".gray + engine_version);
                console.log("OS : ".gray + (os.type()).white);
                console.log("OS PLATFORM : ".gray + (os.platform()).white);
                console.log("OS ARCHITECTURE : ".gray + (os.arch()).white);
                console.log("OS VERSION : ".gray + (os.release()).white);
                console.log("OS TIME : ".gray + (os.uptime()));
                console.log("CPU : ".gray + ((os.cpus())[0].model).white);
                console.log("CPU ENDIANNESS : ".gray + (os.endianness()).white);
                console.log("FREE MEMORY : ".gray + (os.freemem()));
                console.log("TOTAL MEMORY : ".gray + (os.totalmem()));

                console.log(" - ctrl+q 로 돌아갑니다 - ".gray);
                break;

            case 3:
                console.log("Game log clear".inverse);
                for (var i = 0; i < server_log_queue.length(); i++) {
                    server_log_queue.dequeue();
                }
                console.log("초기화 완료".white);
                console.log(" - ctrl+q 로 돌아갑니다 - ".gray);
                break;

            /*case 1:
                console.log("다음을 입력해주십시오");
    
                rl.prompt();
                rl.once("line", (data) => {
                    console.log(data);
                    mode = 0;
                    console_mode();
                });
                break;*/
        }
    }
    // #endregion

    // fork
    os.cpus().forEach(function (cpu) {
        cluster.fork();
    });

    // worker starting
    for (var id in cluster.workers) {
        cluster.workers[id].send({ type: 'start', to: 'worker' });
    }
}

if (cluster.isWorker) {
    // PIPE
    process.on('message', function (message) {
        if (message.to == 'worker') {
            switch (message.type) {
                case 'start':
                    server.listen(port, ip);
                    break;
            }
        }
    });

    // Connection
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
}