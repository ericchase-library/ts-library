import { describe, expect, test } from 'bun:test';
import { FuzzyMatcher, IFuzzyMatchListResult, TextProcessor } from './FuzzySearch.js';

describe('FuzzyMatcher', () => {
  test('snapshot', () => {
    const candidates = [
      'Shortcuts Manual',
      'Back',
      'Forward',
      'Reload Tab',
      'Hard Reload Tab',
      'Next Page',
      'Previous Page',
      'Remove URL Params',
      'Go Up',
      'Go To Root',
      'Focus Text Input',
      'Focus Media Player',
      'Blur Element',
      'Copy URL',
      'Copy Title',
      'Copy Title and URL',
      'Web Search for Selected Text',
      'Scroll Down',
      'Scroll Up',
      'Scroll Left',
      'Scroll Right',
      'Scroll Page Down',
      'Scroll Page Up',
      'Scroll Half Page Down',
      'Scroll Half Page Up',
      'Scroll To Top',
      'Scroll To Bottom',
      'Zoom In',
      'Zoom Out',
      'Zoom Reset',
      'Toggle Full Screen',
      'New Tab',
      'New Tab to the Right',
      'New Window',
      'New Incognito Window',
      'Close Tab',
      'Close Window',
      'Restore Tab',
      'Duplicate Tab',
      'Pin/Unpin Tab',
      'Group/Ungroup Tab',
    ];
    const query = 'tab n';
    const textProcessor = new TextProcessor([
      (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, ''), //
      (s) => s.toLocaleLowerCase(),
    ]);
    const fuzzyMatcher = new FuzzyMatcher();
    const resultsList: IFuzzyMatchListResult[][] = [];
    for (const targetWord of query.split(' ')) {
      resultsList.push(fuzzyMatcher.searchList(textProcessor.run(candidates), textProcessor.run(targetWord), 2));
    }
    expect(resultsList).toMatchSnapshot();
  });
});
