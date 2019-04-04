'use strict';
// * Local Module Requires
const uuid_v4 = require('./Functions/uuid_v4');

// * Class Definition
class server {
    constructor() {
        this.user = require('./Functions/user');
        this.user_list = require('./Functions/user_list');
        this.signal = require('./signal');
        this.buffer_manager = require('./Functions/buffer');
        const EventEmitter = require('events');
        this.net = require('net').createServer();
        this.Emitter = new EventEmitter();
    }
    listen(ip, port) {
        if (ip == "any")
            this.net.listen(port);
        else
            this.net.listen(port, ip);
        this.Emitter.emit(`start`);
    }
    onSomething(dsocket) {
        this.net.on('connection', function (socket) {
            socket.setNoDelay(true);
            socket.setTimeout(5000);
            socket.on('timeout', ()=>{socket.end();});
            dsocket(new Socket(socket));
        });
    }
    uuid() {
        return uuid_v4();
    }
}

class Socket {
    constructor(socket) {
        this.uuid = uuid_v4();
        this.socket = socket;
    }
    onMessage(func) {
        this.socket.on('data', (data)=>{
            // 데이터 가공 전
            
            // 데이터 가공 후
            
            func(data);
        });
    }
    onClose(func) {this.socket.on('close', ()=>{func(); this.socket.destroy();});}
    onError(func) {this.socket.on('error', ()=>{func(); this.socket.destroy();});}
    send_raw(data) {this.socket.write(data);}
    send(buffer) {
        var send_buffer = Buffer.allocUnsafe(buffer.write_offset + 2);
        (buffer.buffer).copy(send_buffer, 2, 0, buffer.write_offset);
        send_buffer.writeUInt16LE(buffer.write_offset, 0);
        this.socket.write(send_buffer);
    }
}

// * Module Exports
module.exports = server;