import * as http from 'http';
import * as io from 'socket.io';
import { start } from '../Event/start';
import { finish } from '../Event/finish';
import { error } from '../Event/error';

class IOSocket {
    socket: io.Socket;
    constructor(socket: io.Socket) {
        this.socket = socket;
    }

    onMessage(func: Function) {
        this.socket.on('message', function(data: any) {
            func(data);
        });
    }

    onClose(func: any) {
        this.socket.on('disconnect', func);
        this.socket.on('error', (err: any) => {
            console.log(err);
            func();
            this.socket.disconnect();
        });
    }

    send(data: any) {
        this.socket.send(data);
    }

    emit(event: string, data: string) {
        this.socket.emit(event, data);
    }
}

class Server {
    ioProxy = http.createServer();
    ioServer = io.listen(this.ioProxy);

    constructor() {
        this.ioProxy.on('error', err => {
            error(this, err);
        });
        this.ioProxy.on('listening', () => {
            start(this);
        });
        this.ioProxy.on('close', () => {
            finish(this);
        });
    }

    listen(port: number) {
        this.ioProxy.listen(port);
    }

    onConnection(func: Function) {
        this.ioServer.sockets.on('connection', socket => {
            func(new IOSocket(socket));
        });
    }
}

export { Server, IOSocket };
