// ! Class Definition
class buffer {
    constructor() {
        this.u8 = 0;
        this.s8 = 1;
        this.u16 = 2;
        this.s16 = 3;
        this.u32 = 4;
        this.s32 = 5;
        this.string = 6;
        this.WRITE = 1;
        this.READ = 2;
    }
    read(buffer, type) {
        return read_function[type](buffer);
    }
    write(buffer, type, value) {
        write_function[type](buffer, value);
    }
    create(size) {
        return { buffer: Buffer.allocUnsafe(size), write_offset : 0, read_offset : 0 };
    }
    free(buffer) {
        buffer.buffer = null;
        buffer.read_offset = null;
        buffer.write_offset = null;
        buffer.mode = null;
    }
}

// ! Function Definition
var read_function = []
// #region Function's
read_function.push((buffer)=>{buffer.read_offset++; return buffer.buffer.readUInt8(buffer.read_offset - 1);});
read_function.push((buffer)=>{buffer.read_offset++; return buffer.buffer.readInt8(buffer.read_offset - 1);});
read_function.push((buffer)=>{buffer.read_offset+= 2; return buffer.buffer.readUInt16LE(buffer.read_offset - 2);});
read_function.push((buffer)=>{buffer.read_offset+= 2; return buffer.buffer.readInt16LE(buffer.read_offset - 2);});
read_function.push((buffer)=>{buffer.read_offset+= 4; return buffer.buffer.readUInt32LE(buffer.read_offset - 4);});
read_function.push((buffer)=>{buffer.read_offset+= 4; return buffer.buffer.readInt32LE(buffer.read_offset - 4);});
read_function.push((buffer)=>{var length = buffer_read(buffer, 2); buffer.read_offset += length + 1; return buffer.buffer.toString('utf-8', buffer.read_offset - length - 1, buffer.read_offset - 1);});
// #endregion

var write_function = []
// #region Function's
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 1 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 1);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset++;
    (buffer.buffer).writeUInt8(value, buffer.write_offset - 1);
});
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 1 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((write.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 1);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset++;
    (buffer.buffer).writeInt8(value, buffer.write_offset - 1);
});
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 2 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 2);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset += 2;
    (buffer.buffer).writeUInt16LE(value, buffer.write_offset - 2);
});
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 2 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 2);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset += 2;
    (buffer.buffer).writeInt16LE(value, buffer.write_offset - 2);
});
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 4 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 4);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset += 4;
    (buffer.buffer).writeUInt32LE(value, buffer.write_offset - 4);
});
write_function.push((buffer, value)=>{
    if (buffer.write_offset + 4 > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + 4);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset += 4;
    (buffer.buffer).writeInt32LE(value, buffer.write_offset - 4);
});
write_function.push((buffer, value)=>{
    value = value + '\0';
    var length = Buffer.byteLength(value);
    if (buffer.write_offset + length > (buffer.buffer).length) {
        var temp = Buffer.allocUnsafe((buffer.buffer).length*2);
        (buffer.buffer).copy(temp, 0, 0, (buffer.buffer).length*2);
        (buffer.buffer) = Buffer.allocUnsafe((buffer.buffer).length*2 + length);
        temp.copy((buffer.buffer), 0, 0, temp.length);
    }
    buffer.write_offset += length;
    (buffer.buffer).write(value, buffer.wrtite_offset - length, buffer.write_offset);
});
// #endregion


// ! Module Exports
module.exports = buffer;