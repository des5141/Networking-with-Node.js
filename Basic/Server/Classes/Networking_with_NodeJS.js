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
        const event_emitter = require('events');
        this.net = require('net').createServer();
        this.Emitter = new event_emitter();
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
            //socket.setTimeout(5000);
            //socket.on('timeout', ()=>{socket.end();});
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
        this.before_data = -1;
        this.read_length = -1;
        this.read_mode = 0; // 0 is wait, 1 is reading
    }
    onMessage(func) {
        this.socket.on('data', (data)=>{
            // * Before data loading
            if (this.before_data != -1)
                data = this.before_data + data;
            
            // * Processing the data
            while(data.length > 0) {
                // * if data waiting
                if ((this.read_mode == 0) && (data.length >= 2)) {
                    this.read_length = data.readUInt16LE(0); // ? Full Packet Size
                    this.read_mode = 1;
                }

                // * if data reading,
                // * data length is long than read_length
                if ((this.read_mode == 1) && (this.read_length <= data.length)) {
                    var temp_buffer = Buffer.allocUnsafe(this.read_length-2); // * Make buffer for "func" Function
                    data.copy(temp_buffer, 0, 2, this.read_length); // * Insert data into temp_buffer
                    func(temp_buffer); // * Running the crap data

                    var before_data = Buffer.allocUnsafe(data.length - this.read_length); // * Remove crapped data
                    data.copy(before_data, 0, this.read_length, data.length); // * Insert data in before_data
                    data = before_data;
                    this.read_mode = 0;
                    continue; // * one more time !
                }

                // * End
                break;
            }
        });
    }
    onClose(func) {this.socket.on('close', ()=>{func(); this.socket.destroy();});}
    onError(func) {this.socket.on('error', ()=>{func(); this.socket.destroy();});}
    send_raw(data) {this.socket.write(data);}
    send(buffer) {
        var send_buffer = Buffer.allocUnsafe(buffer.write_offset + 2);
        (buffer.buffer).copy(send_buffer, 2, 0, buffer.write_offset);
        send_buffer.writeUInt16LE(buffer.write_offset+2, 0);
        this.socket.write(send_buffer);
    }
}

// * Module Exports
module.exports = server;