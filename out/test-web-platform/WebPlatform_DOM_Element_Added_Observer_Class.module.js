// src/lib/ericchase/Core_Promise_Deferred_Class.ts
class Class_Core_Promise_Deferred_Class {
  promise;
  reject;
  resolve;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (this.resolve === undefined || this.reject === undefined) {
      throw new Error(`${Class_Core_Promise_Deferred_Class.name}'s constructor failed to setup promise functions.`);
    }
  }
}
function Core_Promise_Deferred_Class() {
  return new Class_Core_Promise_Deferred_Class();
}

// src/lib/ericchase/Core_Utility_Sleep.ts
function Async_Core_Utility_Sleep(duration_ms) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, duration_ms),
  );
}

// src/lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.ts
class Class_WebPlatform_DOM_Element_Added_Observer_Class {
  config;
  $match_set = new Set();
  $mutation_observer;
  $subscription_set = new Set();
  constructor(config) {
    this.config = {
      include_existing_elements: config.include_existing_elements ?? true,
      options: {
        subtree: config.options?.subtree ?? true,
      },
      selector: config.selector,
      source: config.source ?? document.documentElement,
    };
    this.$mutation_observer = new MutationObserver((mutationRecords) => {
      const sent_set = new Set();
      for (const record of mutationRecords) {
        for (const node of record.addedNodes) {
          const tree_walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
          const processCurrentNode = () => {
            if (sent_set.has(tree_walker.currentNode) === false) {
              if (tree_walker.currentNode instanceof Element && tree_walker.currentNode.matches(this.config.selector) === true) {
                this.$send(tree_walker.currentNode);
                sent_set.add(tree_walker.currentNode);
              }
            }
          };
          processCurrentNode();
          if (this.config.options.subtree === true) {
            while (tree_walker.nextNode()) {
              processCurrentNode();
            }
          }
        }
      }
    });
    this.$mutation_observer.observe(this.config.source, {
      childList: true,
      subtree: this.config.options.subtree,
    });
    if (this.config.include_existing_elements === true) {
      if (this.config.options.subtree === true) {
        const sent_set = new Set();
        const tree_walker = document.createTreeWalker(this.config.source, NodeFilter.SHOW_ELEMENT);
        const processCurrentNode = () => {
          if (sent_set.has(tree_walker.currentNode) === false) {
            if (tree_walker.currentNode instanceof Element && tree_walker.currentNode.matches(this.config.selector) === true) {
              this.$send(tree_walker.currentNode);
              sent_set.add(tree_walker.currentNode);
            }
          }
        };
        while (tree_walker.nextNode()) {
          processCurrentNode();
        }
      } else {
        for (const child of this.config.source.childNodes) {
          if (child instanceof Element && child.matches(this.config.selector) === true) {
            this.$send(child);
          }
        }
      }
    }
  }
  disconnect() {
    this.$mutation_observer.disconnect();
    for (const callback of this.$subscription_set) {
      this.$subscription_set.delete(callback);
    }
  }
  subscribe(callback) {
    this.$subscription_set.add(callback);
    let abort = false;
    for (const element of this.$match_set) {
      callback(element, () => {
        this.$subscription_set.delete(callback);
        abort = true;
      });
      if (abort) {
        return () => {};
      }
    }
    return () => {
      this.$subscription_set.delete(callback);
    };
  }
  $send(element) {
    this.$match_set.add(element);
    for (const callback of this.$subscription_set) {
      callback(element, () => {
        this.$subscription_set.delete(callback);
      });
    }
  }
}
function WebPlatform_DOM_Element_Added_Observer_Class(config) {
  return new Class_WebPlatform_DOM_Element_Added_Observer_Class(config);
}

// src/test-web-platform/WebPlatform_DOM_Element_Added_Observer_Class.module.ts
import { expect } from './chai.module.js';
var { promise, resolve } = Core_Promise_Deferred_Class();
async function Test_1() {
  const observer = WebPlatform_DOM_Element_Added_Observer_Class({
    selector: 'div',
    options: {
      subtree: false,
    },
    source: document.body,
  });
  const received = [];
  observer.subscribe((element) => {
    received.push(element);
  });
  await promise;
  observer.disconnect();
  expect(received[0].id).to.equal('n1');
  expect(received[1].id).to.equal('n2');
  expect(received[2].id).to.equal('n3');
  console.log('Test 1 Passed');
}
async function Test_2() {
  const observer = WebPlatform_DOM_Element_Added_Observer_Class({
    selector: 'div',
    options: {
      subtree: true,
    },
    source: document.body,
  });
  const received = [];
  observer.subscribe((element) => {
    received.push(element);
  });
  await promise;
  observer.disconnect();
  expect(received[0].id).to.equal('n1');
  expect(received[1].id).to.equal('n2');
  expect(received[2].id).to.equal('n2.2');
  expect(received[3].id).to.equal('n3');
  expect(received[4].id).to.equal('n4');
  expect(received[5].id).to.equal('n4');
  console.log('Test 2 Passed');
}
Test_1();
Test_2();
await Async_Core_Utility_Sleep(100);
document.body.insertAdjacentHTML('beforeend', '<div id="n1">1</div>');
await Async_Core_Utility_Sleep(100);
document.body.insertAdjacentHTML('beforeend', '<div id="n2"><span>2</span><div id="n2.2">Inner</div></div>');
await Async_Core_Utility_Sleep(100);
var div3 = document.createElement('div');
div3.setAttribute('id', 'n3');
div3.textContent = '3';
document.body.appendChild(div3);
var div4 = document.createElement('div');
div4.setAttribute('id', 'n4');
div4.textContent = 'Inner';
div3.appendChild(div4);
await Async_Core_Utility_Sleep(100);
div4.remove();
await Async_Core_Utility_Sleep(100);
div3.appendChild(div4);
resolve();
