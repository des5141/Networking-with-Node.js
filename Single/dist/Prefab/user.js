"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4_1 = __importDefault(require("uuidv4"));
// Events
function userError(user, err) {
    console.log(err);
}
exports.userError = userError;
// Classes
var user = /** @class */ (function () {
    function user(iosocket) {
        var _this = this;
        this.uuid = uuidv4_1.default();
        this.room = -1;
        this.iosocket = iosocket;
        this.iosocket.socket.on('error', function (err) {
            userError(_this, err);
        });
    }
    return user;
}());
exports.user = user;
var userList = /** @class */ (function () {
    function userList() {
        this.users = [];
    }
    userList.prototype.addUser = function (user) {
        this.users[user.uuid] = user;
    };
    userList.prototype.removeUser = function (user) {
        delete this.users[user.uuid];
    };
    userList.prototype.findUser = function (uuid) {
        return this.users[uuid];
    };
    userList.prototype.findUserBySocket = function (iosocket) {
        for (var uuid in this.users) {
            if (this.users[uuid].iosocket === iosocket) {
                return this.users[uuid];
            }
        }
    };
    userList.prototype.each = function (func) {
        for (var uuid in this.users) {
            func(this.users[uuid]);
        }
    };
    return userList;
}());
exports.userList = userList;
