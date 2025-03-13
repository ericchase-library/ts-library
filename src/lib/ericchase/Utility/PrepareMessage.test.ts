import { describe, expect, test } from 'bun:test';
import { PrepareMessage } from 'src/lib/ericchase/Utility/PrepareMessage.js';

describe(PrepareMessage.name, () => {
  describe('Basic', () => {
    const message = `
      Testing
      1
      2
      3
    `;
    test('Trims each line.', () => {
      expect(PrepareMessage(message)).toBe('Testing\n1\n2\n3');
    });
    test('Prepends each line with required spaces.', () => {
      expect(PrepareMessage(message, 8)).toBe('        Testing\n        1\n        2\n        3');
    });
  });
  describe('Complex', () => {
    const message = `
      Commands
        1 - Command A
        2 - Command B
        3 - Command C

      Description

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non
        felis in ipsum porttitor pulvinar et ac enim. Maecenas rhoncus tincidunt
        turpis, vel suscipit enim ultricies at. Curabitur vel neque ut metus
        accumsan cursus. Nunc ultricies nulla at magna pharetra fringilla.
        Aenean at dolor et arcu fringilla congue sit amet at est. Sed in elit
        vel orci eleifend elementum. Integer efficitur, leo ac feugiat
        tincidunt, purus quam scelerisque turpis, tincidunt maximus sem quam in
        lectus. Integer vel metus quis massa pretium ultricies. Nullam lobortis
        lorem porta convallis posuere.
    `;
    test('Trims each line.', () => {
      expect(PrepareMessage(message)).toBe(
        [
          'Commands',
          '  1 - Command A',
          '  2 - Command B',
          '  3 - Command C',
          '',
          'Description',
          '',
          '    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non',
          '  felis in ipsum porttitor pulvinar et ac enim. Maecenas rhoncus tincidunt',
          '  turpis, vel suscipit enim ultricies at. Curabitur vel neque ut metus',
          '  accumsan cursus. Nunc ultricies nulla at magna pharetra fringilla.',
          '  Aenean at dolor et arcu fringilla congue sit amet at est. Sed in elit',
          '  vel orci eleifend elementum. Integer efficitur, leo ac feugiat',
          '  tincidunt, purus quam scelerisque turpis, tincidunt maximus sem quam in',
          '  lectus. Integer vel metus quis massa pretium ultricies. Nullam lobortis',
          '  lorem porta convallis posuere.',
        ].join('\n'),
      );
    });
    test('Prepends each line with required spaces.', () => {
      expect(PrepareMessage(message, 8)).toBe(
        [
          '        Commands',
          '          1 - Command A',
          '          2 - Command B',
          '          3 - Command C',
          '        ',
          '        Description',
          '        ',
          '            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non',
          '          felis in ipsum porttitor pulvinar et ac enim. Maecenas rhoncus tincidunt',
          '          turpis, vel suscipit enim ultricies at. Curabitur vel neque ut metus',
          '          accumsan cursus. Nunc ultricies nulla at magna pharetra fringilla.',
          '          Aenean at dolor et arcu fringilla congue sit amet at est. Sed in elit',
          '          vel orci eleifend elementum. Integer efficitur, leo ac feugiat',
          '          tincidunt, purus quam scelerisque turpis, tincidunt maximus sem quam in',
          '          lectus. Integer vel metus quis massa pretium ultricies. Nullam lobortis',
          '          lorem porta convallis posuere.',
        ].join('\n'),
      );
    });
  });
  describe('Append and prepend blank lines.', () => {
    test('Append to empty message.', () => {
      expect(PrepareMessage('', 0, 3)).toBe('\n\n\n');
    });
    test('Prepend to empty message', () => {
      expect(PrepareMessage('', 0, 0, 3)).toBe('\n\n\n');
    });
    test('Append and prepend to empty message', () => {
      expect(PrepareMessage('', 0, 3, 3)).toBe('\n\n\n\n\n\n');
    });
    test('Append to space.', () => {
      expect(PrepareMessage(' ', 0, 3)).toBe('\n\n\n');
    });
    test('Prepend to space', () => {
      expect(PrepareMessage(' ', 0, 0, 3)).toBe('\n\n\n');
    });
    test('Append and prepend to space', () => {
      expect(PrepareMessage(' ', 0, 3, 3)).toBe('\n\n\n\n\n\n');
    });
    test('Append to "a".', () => {
      expect(PrepareMessage('a', 0, 3)).toBe('a\n\n\n');
    });
    test('Prepend to "a"', () => {
      expect(PrepareMessage('a', 0, 0, 3)).toBe('\n\n\na');
    });
    test('Append and prepend to "a"', () => {
      expect(PrepareMessage('a', 0, 3, 3)).toBe('\n\n\na\n\n\n');
    });

    const message = `
      A
        B
          C
    `;
    test('A/B/C Append', () => {
      expect(PrepareMessage(message, 0, 3)).toBe('A\n  B\n    C\n\n\n');
    });
    test('A/B/C Prepend', () => {
      expect(PrepareMessage(message, 0, 0, 3)).toBe('\n\n\nA\n  B\n    C');
    });
    test('A/B/C Both', () => {
      expect(PrepareMessage(message, 0, 3, 3)).toBe('\n\n\nA\n  B\n    C\n\n\n');
    });
  });
});
