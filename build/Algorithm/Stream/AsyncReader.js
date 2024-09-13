import { ConsoleError } from '../../Utility/Console.js';
export async function* AsyncReader(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } catch (error) {
    ConsoleError('Error reading from stream:', error);
  } finally {
    reader.releaseLock();
  }
}
export async function* AsyncLineReader(stream) {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  try {
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.length > 0) {
          yield [buffer];
        }
        return;
      }
      const lines = (buffer + value).split('\n');
      buffer = lines[lines.length - 1] ?? '';
      yield lines.slice(0, -1);
    }
  } catch (error) {
    ConsoleError('Error reading from stream:', error);
  } finally {
    reader.releaseLock();
  }
}
