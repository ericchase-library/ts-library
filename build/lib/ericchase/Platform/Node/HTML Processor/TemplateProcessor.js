import * as Parser from 'node-html-parser';
import node_fs from 'node:fs';
import { Path } from '../Path.js';
import { ParseHTML } from './ParseHTML.js';
export async function LoadHtmlFile(filePath) {
  try {
    const html = await node_fs.promises.readFile(filePath.path, { encoding: 'utf8' });
    return ParseHTML(html);
  } catch (err) {
    throw `Could not open file: ${filePath}`;
  }
}
export async function SaveHtmlFile(root, path) {
  await node_fs.promises.writeFile(path.path, root.toString(), { encoding: 'utf8' });
}
const includeMap = new Map();
export function RegisterIncludeSource(includeName, includeHTML) {
  includeMap.set(includeName, includeHTML);
}
export async function LoadIncludeFile(includeName, includePath) {
  try {
    const html = await node_fs.promises.readFile(includePath.path, { encoding: 'utf8' });
    includeMap.set(includeName, html);
    return html;
  } catch (err) {
    throw `Could not open file: ${includePath.path}`;
  }
}
async function getInclude(includeName) {
  const html = includeMap.get(includeName);
  if (html) {
    return ParseHTML(html);
  }
  try {
    return ParseHTML(await LoadIncludeFile(includeName, new Path(`${includeName}.html`)));
  } catch (err) {
    throw `Could not load include: ${includeName}`;
  }
}
export async function ProcessTemplateNode(root) {
  const stack = toReversed(root.childNodes);
  while (stack.length > 0) {
    const node = stack.pop();
    if (node instanceof Parser.HTMLElement) {
      if (node.tagName === 'INCLUDE') {
        const newNode = await processInclude(node);
        stack.push(...toReversed(newNode.childNodes));
      } else {
        stack.push(...toReversed(node.childNodes));
      }
    }
  }
  return root;
}
export async function ProcessTemplateFile(templatePath, outputPath) {
  await SaveHtmlFile(await ProcessTemplateNode(await LoadHtmlFile(templatePath)), outputPath);
}
async function processInclude(oldItem) {
  const oldChildNodes = trimNodelist(oldItem.childNodes);
  const includeName = Object.keys(oldItem.attributes)[0];
  oldItem.removeAttribute(includeName);
  const root = await getInclude(includeName);
  const newItem = (() => {
    const childNodes = trimNodelist(root.childNodes);
    if (childNodes.length === 1) {
      oldItem.replaceWith(childNodes[0]);
      return childNodes[0];
    }
    if (childNodes.length > 1) {
      oldItem.replaceWith(...childNodes);
      for (const child of childNodes) {
        if (child instanceof Parser.HTMLElement) {
          return child;
        }
      }
      return childNodes[0];
    }
    return oldItem;
  })();
  if (newItem !== oldItem) {
    if (newItem instanceof Parser.HTMLElement) {
      newItem.setAttributes({ ...oldItem.attributes, ...newItem.attributes });
      const classList = [...oldItem.classList.values(), ...newItem.classList.values()];
      for (const value of newItem.classList.values()) {
        newItem.classList.remove(value);
      }
      for (const value of classList) {
        newItem.classList.add(value);
      }
    }
    if (oldChildNodes.length > 0) {
      const slot = findSlot(root);
      if (slot) slot.replaceWith(...oldChildNodes);
    }
    return newItem;
  }
  return oldItem;
}
function findSlot(root) {
  const stack = toReversed(root.childNodes);
  while (stack.length > 0) {
    const item = stack.pop();
    if (item instanceof Parser.HTMLElement) {
      if (item.tagName === 'SLOT') {
        return item;
      }
      stack.push(...toReversed(item.childNodes));
    }
  }
  return;
}
function trimNodelist(nodes) {
  let start = 0;
  for (const node of nodes) {
    if (node.nodeType === 3) {
      if (node.rawText.trim() === '') {
        start++;
        continue;
      }
    }
    break;
  }
  let end = nodes.length;
  for (const node of toReversed(nodes)) {
    if (node.nodeType === 3) {
      if (node.rawText.trim() === '') {
        end--;
        continue;
      }
    }
    break;
  }
  return nodes.slice(start, end);
}
function toReversed(tree) {
  const reversed = [];
  for (let index = tree.length; index > 0; index--) {
    reversed.push(tree[index - 1]);
  }
  return reversed;
}
