'use strict';
// * Local Module Requires
const uuid_v4 = require('./Functions/uuid_v4');
var json_mode = false;

// * Class Definition
class server {
  constructor () {
    const event_emitter = require('events');
    this.user = require('./Functions/user');
    this.user_list = require('./Functions/user_list');
    this.signal = require('./Signal/signal');
    this.buffer_manager = require('./Functions/buffer');
    this.net = require('net').createServer();
    this.sio_proxy = require('http').createServer();
    this.sio_net = require('socket.io').listen(this.sio_proxy);
    this.Emitter = new event_emitter();
    this.server_wait = false;
    this.json_mode = false;
  }

  listen (ip, port, sio_port) {
    // ! TCP Server
    this.net.on('listening', () => {
      if (this.server_wait == true) { this.Emitter.emit('start'); } else { this.server_wait = true; }
    });
    this.net.on('error', (err) => {
      console.log(`ERROR! tcp failed - ${err}`);
    });

    // ! Socket.io
    this.sio_proxy.on('listening', () => {
      if (this.server_wait == true) { this.Emitter.emit('start'); } else { this.server_wait = true; }
    });
    this.sio_proxy.on('error', (err) => {
      console.log(`ERROR! socket.io failed - ${err}`);
    });

    // TODO: Start
    if (ip == 'any') {
      this.net.listen(port);
      this.sio_proxy.listen(sio_port);
    } else {
      this.net.listen(port, ip);
      this.sio_proxy.listen(sio_port, ip);
    }
    json_mode = this.json_mode;
  }

  onSomething (dsocket) {
    this.net.on('connection', function (socket) {
      socket.setNoDelay(false);
      dsocket(new Socket(socket, true));
    });
    this.sio_net.on('connection', function (socket) {
      dsocket(new Socket(socket, false));
    });
  }

  uuid () {
    return uuid_v4();
  }
}

class Socket {
  constructor (socket, type) {
    this.uuid = uuid_v4();
    this.socket = socket;
    this.before_data = -1;
    this.read_length = -1;
    this.read_mode = 0; // 0 is wait, 1 is reading
    this.header_size = 4;
    this.networking_type = type; // true - net , false - Socket.io
  }

  onMessage (func) {
    if (json_mode == false) {
      if (this.networking_type == true) {
        this.socket.on('data', (data) => {
          // * Before data loading
          if (this.before_data != -1) { data = this.before_data + data; }

          // * Processing the data
          while (data.length > 0) {
            // * if data waiting
            if ((this.read_mode == 0) && (data.length >= this.header_size)) {
              this.read_length = data.readUInt32LE(0); // ! Change this !!!! If header_size was replaced!
              this.read_mode = 1;
            }

            // * if data reading,
            // * data length is long than read_length
            if ((this.read_mode == 1) && (this.read_length <= data.length)) {
              var temp_buffer = Buffer.allocUnsafe(this.read_length - this.header_size); // * Make buffer for "func" Function
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
      } else {
        this.socket.on('message', (data) => {
          console.log(data);
          // * Before data loading
          if (this.before_data != -1) { data = this.before_data + data; }

          // * Processing the data
          while (data.length > 0) {
            // * if data waiting
            if ((this.read_mode == 0) && (data.length >= this.header_size)) {
              this.read_length = data.readUInt32LE(0); // ! Change this !!!! If header_size was replaced!
              this.read_mode = 1;
            }

            // * if data reading,
            // * data length is long than read_length
            if ((this.read_mode == 1) && (this.read_length <= data.length)) {
              var temp_buffer = Buffer.allocUnsafe(this.read_length - this.header_size); // * Make buffer for "func" Function
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
    }else {
      this.socket.on('message', (data) => { func(data); });
    }
  }

  onClose (func) {
    if (this.networking_type == true) { var type = 'close'; } else { var type = 'disconnect'; }
    this.socket.on(type, () => { func(); if (this.networking_type) { this.socket.destroy(); } else { this.socket.disconnect(); } });
  }

  onError (func) { this.socket.on('error', () => { func(); if (this.networking_type) { this.socket.destroy(); } else { this.socket.disconnect(); } }); }
  send_raw (data) { this.socket.write(data); }
  send (buffer) {
    var send_buffer = Buffer.allocUnsafe(buffer.write_offset + this.header_size);
    (buffer.buffer).copy(send_buffer, this.header_size, 0, buffer.write_offset);
    send_buffer.writeUInt32LE(buffer.write_offset + this.header_size, 0); // ! Change this !!!! If header_size was replaced!

    if (this.networking_type == true) { this.socket.write(send_buffer); } else { this.socket.send(send_buffer); }
  }
}

// * Module Exports
module.exports = server;
