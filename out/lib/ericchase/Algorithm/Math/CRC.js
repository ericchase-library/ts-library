const crc_table = new Uint32Array(256);
const crc_magic = new Uint32Array(1);
crc_magic[0] = 3988292384;
for (let n = 0;n < 256; n++) {
  let c = n >>> 0;
  for (let k = 0;k < 8; k++) {
    if (c & 1) {
      c = crc_magic[0] ^ c >>> 1;
    } else {
      c >>>= 1;
    }
  }
  crc_table[n] = c;
}
export var CRC;
((CRC) => {
  function Init(bytes) {
    return (CRC.Update(4294967295 >>> 0, bytes) ^ 4294967295 >>> 0) >>> 0;
  }
  CRC.Init = Init;
  function Update(crc, bytes) {
    let c = crc >>> 0;
    for (let n = 0;n < bytes.length; n++) {
      c = crc_table[(c ^ bytes[n]) & 255] ^ c >>> 8;
    }
    return c >>> 0;
  }
  CRC.Update = Update;
})(CRC ||= {});
