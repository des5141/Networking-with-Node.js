class Queue {
    constructor() {
        this._arr = [];
    }
    enqueue(item) {
        this._arr.push(item);
    }
    dequeue() {
        return this._arr.shift();
    }
    length() {
        return this._arr.length;
    }
    destroy(message) {
        if (this._arr.indexOf(message) != -1) {
            this._arr.splice(this._arr.indexOf(message), 1);
        }
    }
    pick(i) {
        return this._arr[i];
    }
}
module.exports = Queue;