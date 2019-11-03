"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4_1 = __importDefault(require("uuidv4"));
var room = /** @class */ (function () {
    function room() {
        this.users = [];
        this.uuid = uuidv4_1.default();
    }
    room.prototype.addUser = function (user) {
        this.users[user.uuid] = user;
        user.room = this;
    };
    room.prototype.removeUser = function (user) {
        user.room = -1;
        delete this.users[user.uuid];
    };
    room.prototype.findUser = function (uuid) {
        return this.users[uuid];
    };
    room.prototype.findUserBySocket = function (socket) {
        for (var uuid in this.users) {
            if (this.users[uuid].socket === socket) {
                return this.users[uuid];
            }
        }
    };
    room.prototype.each = function (func) {
        for (var uuid in this.users) {
            func(this.users[uuid]);
        }
    };
    return room;
}());
exports.room = room;
var roomList = /** @class */ (function () {
    function roomList() {
        this.rooms = [];
    }
    roomList.prototype.addRoom = function (room) {
        this.rooms[room.uuid] = room;
    };
    roomList.prototype.removeRoom = function (uuid) {
        delete this.rooms[uuid];
    };
    roomList.prototype.findRoom = function (uuid) {
        return this.rooms[uuid];
    };
    roomList.prototype.each = function (func) {
        for (var uuid in this.rooms) {
            func(this.rooms[uuid]);
        }
    };
    return roomList;
}());
exports.roomList = roomList;
