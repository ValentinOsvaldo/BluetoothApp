import { Buffer } from 'buffer';

export const base64ToArrayBuffer = (data: string): ArrayBuffer => {
  const buffer: Buffer = Buffer.from(data, 'base64');

  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
};
