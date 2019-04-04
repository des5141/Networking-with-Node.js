function buffer_read(buffer, type, read) {
    switch (type) {
        case 0:
            read.offset++;
            return buffer.readUInt8(read.offset - 1);

        case 1:
            read.offset++;
            return buffer.readInt8(read.offset - 1);

        case 2:
            read.offset += 2;
            return buffer.readUInt16LE(read.offset - 2);

        case 3:
            read.offset += 2;
            return buffer.readInt16LE(read.offset - 2);

        case 4:
            read.offset += 4;
            return buffer.readUInt32LE(read.offset - 4);

        case 5:
            read.offset += 4;
            return buffer.readInt132LE(read.offset - 4);

        case 6:
            var length = buffer_read(buffer, 2, read);
            read.offset += length + 1;
            return buffer.toString('utf-8', read.offset - length - 1, read.offset - 1);
    }
}
function buffer_write(write, type, value) {
    switch (type) {
        case 0:
            if (write.offset + 1 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset++;
            (write.buffer).writeUInt8(value, write.offset - 1);
            break;

        case 1:
            if (write.offset + 1 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset++;
            (write.buffer).writeInt8(value, write.offset - 1);
            break;

        case 2:
            if (write.offset + 2 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 2;
            (write.buffer).writeUInt16LE(value, write.offset - 2);
            break;

        case 3:
            if (write.offset + 2 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 2;
            (write.buffer).writeInt16LE(value, write.offset - 2);
            break;

        case 4:
            if (write.offset + 4 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 4;
            (write.buffer).writeUInt32LE(value, write.offset - 4);
            break;

        case 5:
            if (write.offset + 4 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 4;
            (write.buffer).writeInt32LE(value, write.offset - 4);
            break;

        case 6:
            value = value + '\0';
            var length = Buffer.byteLength(value);
            if (write.offset + length > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + length).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += length;
            (write.buffer).write(value, write.offset - length, write.offset);
            break;
    }
}
module.exports.buffer_read = buffer_read;
module.exports.buffer_write = buffer_write;