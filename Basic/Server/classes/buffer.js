// #region Buffer Setting
function buffer_init() {
    const buffer_u8 = 0;
    const buffer_s8 = 1;
    const buffer_u16 = 2;
    const buffer_s16 = 3;
    const buffer_u32 = 4;
    const buffer_s32 = 5;
    const buffer_string = 6;
}
// #endregion
// #region Buffer Function
function buffer_read(buffer, type, read) {
    switch (type) {
        case buffer_u8:
            read.offset++;
            return buffer.readUInt8(read.offset - 1);

        case buffer_s8:
            read.offset++;
            return buffer.readInt8(read.offset - 1);

        case buffer_u16:
            read.offset += 2;
            return buffer.readUInt16LE(read.offset - 2);

        case buffer_s16:
            read.offset += 2;
            return buffer.readInt16LE(read.offset - 2);

        case buffer_u32:
            read.offset += 4;
            return buffer.readUInt32LE(read.offset - 4);

        case buffer_s32:
            read.offset += 4;
            return buffer.readInt132LE(read.offset - 4);

        case buffer_string:
            var length = buffer_read(buffer, buffer_u16, read);
            read.offset += length + 1;
            return buffer.toString('utf-8', read.offset - length - 1, read.offset - 1);
    }
}
function buffer_write(write, type, value) {
    switch (type) {
        case buffer_u8:
            if (write.offset + 1 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset++;
            (write.buffer).writeUInt8(value, write.offset - 1);
            break;

        case buffer_s8:
            if (write.offset + 1 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 1).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset++;
            (write.buffer).writeInt8(value, write.offset - 1);
            break;

        case buffer_u16:
            if (write.offset + 2 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 2;
            (write.buffer).writeUInt16LE(value, write.offset - 2);
            break;

        case buffer_s16:
            if (write.offset + 2 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 2).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 2;
            (write.buffer).writeInt16LE(value, write.offset - 2);
            break;

        case buffer_u32:
            if (write.offset + 4 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 4;
            (write.buffer).writeUInt32LE(value, write.offset - 4);
            break;

        case buffer_s32:
            if (write.offset + 4 > (write.buffer).length) {
                var temp = Buffer.allocUnsafe((write.buffer).length).fill(0);
                (write.buffer).copy(temp, 0, 0, (write.buffer).length);
                (write.buffer) = Buffer.allocUnsafe((write.buffer).length + 4).fill(0);
                temp.copy((write.buffer), 0, 0, temp.length);
            }
            write.offset += 4;
            (write.buffer).writeInt32LE(value, write.offset - 4);
            break;

        case buffer_string:
            value = value + '\0';
            var length = Buffer.byteLength(value); // 개행문자를 추가한 길이
            //buffer_write(write, buffer_u16, length);
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
function buffer_create(write) {
    write = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
}
// #endregion
// #region module exports
module.exports.buffer_init = buffer_init();
module.exports.buffer_read = buffer_read;
module.exports.buffer_write = buffer_write;
module.exports.buffer_create = buffer_create;
// #endregion