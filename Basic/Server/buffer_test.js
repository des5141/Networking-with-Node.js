var BM = new (require('./Classes/Functions/buffer'))();

var buffer = BM.create(1024);
let i;
console.time('test');
for(i = 0; i < 1000000; i++) {
    BM.write(buffer, BM.s8, 3);
    BM.write(buffer, BM.u8, 4);
    BM.write(buffer, BM.s16, 4100);
    BM.write(buffer, BM.u16, 32210);
    BM.write(buffer, BM.u32, 123210);
    BM.write(buffer, BM.s32, 123210);
    BM.read(buffer, BM.s8);
    BM.read(buffer, BM.u8);
    BM.read(buffer, BM.s16);
    BM.read(buffer, BM.u16);
    BM.read(buffer, BM.u32);
    BM.read(buffer, BM.s32);
}
console.timeEnd('test');
console.log(`count : ${i} , buffer_size : ${buffer.buffer.length}`);