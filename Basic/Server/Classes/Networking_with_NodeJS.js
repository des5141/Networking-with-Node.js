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
	    this.sio_proxy = require('http').createServer();
	    this.sio_net = require('socket.io').listen(this.sio_proxy);
        this.Emitter = new event_emitter();
    }
    listen(ip, port, sio_port) {
        // ! TCP Server
        this.net.on('listening', ()=>{
            this.Emitter.emit(`start`);
        });
        this.net.on('error', (err)=>{
            console.log(`ERROR! tcp failed - ${err}`);
        });

        // ! Socket.io
        this.sio_proxy.on('error', function(err) {
		    console.log(`ERROR! socket.io failed - ${err}`);
	    });

        // TODO: Start
        if (ip == "any") {
            this.net.listen(port);
			this.sio_proxy.listen(sio_port);
        } else {
            this.net.listen(port, ip);
			this.sio_proxy.listen(sio_port, ip);
        }
    }
    onSomething(dsocket) {
        this.net.on('connection', function (socket) {
            socket.setNoDelay(false);
            dsocket(new Socket(socket, true));
        });
        this.sio_net.on('connection', function (socket) {
            dsocket(new Socket(socket, false));
        });
    }
    uuid() {
        return uuid_v4();
    }
}

class Socket {
    constructor(socket, type) {
        this.uuid = uuid_v4();
        this.socket = socket;
        this.before_data = -1;
        this.read_length = -1;
        this.read_mode = 0; // 0 is wait, 1 is reading
        this.header_size = 4;
        this.networking_type = type; // true is tcp, false is socket.io
    }
    onMessage(func) {
        if (this.networking_type == true)
            var type = 'data';
        else
            var type = 'message';
        this.socket.on(type, (data)=>{
            // * Before data loading
            if (this.before_data != -1)
                data = this.before_data + data;
            
            // * Processing the data
            while(data.length > 0) {
                // * if data waiting
                if ((this.read_mode == 0) && (data.length >= this.header_size)) {
                    this.read_length = data.readUInt32LE(0); // ! Change this !!!! If header_size was replaced!
                    this.read_mode = 1;
                }

                // * if data reading,
                // * data length is long than read_length
                if ((this.read_mode == 1) && (this.read_length <= data.length)) {
                    var temp_buffer = Buffer.allocUnsafe(this.read_length-this.header_size); // * Make buffer for "func" Function
                    data.copy(temp_buffer, 0, this.header_size, this.read_length); // * Insert data into temp_buffer
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
        var send_buffer = Buffer.allocUnsafe(buffer.write_offset + this.header_size);
        (buffer.buffer).copy(send_buffer, this.header_size, 0, buffer.write_offset);
        send_buffer.writeUInt32LE(buffer.write_offset+this.header_size, 0); // ! Change this !!!! If header_size was replaced!
        this.socket.write(send_buffer);
    }
}

// * Module Exports
module.exports = server;