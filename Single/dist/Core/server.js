"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var start_1 = require("../Event/start");
var finish_1 = require("../Event/finish");
var error_1 = require("../Event/error");
var IOSocket = /** @class */ (function () {
    function IOSocket(socket) {
        this.socket = socket;
    }
    IOSocket.prototype.onMessage = function (func) {
        this.socket.on('message', function (data) {
            func(data);
        });
    };
    IOSocket.prototype.onClose = function (func) {
        var _this = this;
        this.socket.on('disconnect', func);
        this.socket.on('error', function (err) {
            console.log(err);
            func();
            _this.socket.disconnect();
        });
    };
    IOSocket.prototype.send = function (data) {
        this.socket.send(data);
    };
    IOSocket.prototype.emit = function (event, data) {
        this.socket.emit(event, data);
    };
    return IOSocket;
}());
exports.IOSocket = IOSocket;
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.ioProxy = http.createServer();
        this.ioServer = socket_io_1.default(this.ioProxy, { pingInterval: 4000 });
        this.ioProxy.on('error', function (err) {
            error_1.error(_this, err);
        });
        this.ioProxy.on('listening', function () {
            start_1.start(_this);
        });
        this.ioProxy.on('close', function () {
            finish_1.finish(_this);
        });
    }
    Server.prototype.listen = function (port) {
        this.ioProxy.listen(port);
    };
    Server.prototype.onConnection = function (func) {
        this.ioServer.sockets.on('connection', function (socket) {
            func(new IOSocket(socket));
        });
    };
    return Server;
}());
exports.Server = Server;
