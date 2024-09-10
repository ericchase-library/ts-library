import { HTMLElement as NodeHTMLParser_HTMLElement, parse } from 'node-html-parser';
export function ParseHTML(html, options = {}) {
  const _options = {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
    comment: false,
    fixNestedATags: false,
    lowerCaseTagName: false,
    parseNoneClosedTags: false,
    voidTag: {
      tags: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
      closingSlash: false,
    },
  };
  if (options.convert_tagnames_to_lowercase === true) {
    _options.lowerCaseTagName = true;
  }
  if (options.keep_text_content_when_parsing !== undefined) {
    _options.blockTextElements = {};
    for (const tag of options.keep_text_content_when_parsing) {
      _options.blockTextElements[tag] = true;
    }
  }
  if (options.on_comment === 'keep') {
    _options.comment = true;
  }
  if (options.on_invalid_nested_a_tag === 'fix') {
    _options.fixNestedATags = true;
  }
  if (options.on_missing_closing_tag === 'add') {
    _options.parseNoneClosedTags = true;
  }
  if (options.self_close_void_tags === true) {
    if (_options.voidTag === undefined) {
      _options.voidTag = { closingSlash: true };
    } else {
      _options.voidTag.closingSlash = true;
    }
  }
  if (options.void_tags !== undefined) {
    if (_options.voidTag === undefined) {
      _options.voidTag = { tags: options.void_tags };
    } else {
      _options.voidTag.tags = options.void_tags;
    }
  }
  return parse(html, _options);
}
