import { Core_Promise_Deferred_Class } from '../lib/ericchase/Core_Promise_Deferred_Class.js';
import { Async_Core_Utility_Sleep } from '../lib/ericchase/Core_Utility_Sleep.js';
import { WebPlatform_DOM_Element_Added_Observer_Class } from '../lib/ericchase/WebPlatform_DOM_Element_Added_Observer_Class.js';
import { expect } from './chai.module.js';

const { promise, resolve } = Core_Promise_Deferred_Class();

async function Test_1() {
  const observer = WebPlatform_DOM_Element_Added_Observer_Class({
    selector: 'div',
    options: {
      subtree: false,
    },
    source: document.body,
  });
  const received: Element[] = [];
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
  const received: Element[] = [];
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
const div3 = document.createElement('div');
div3.setAttribute('id', 'n3');
div3.textContent = '3';
document.body.appendChild(div3);
const div4 = document.createElement('div');
div4.setAttribute('id', 'n4');
div4.textContent = 'Inner';
div3.appendChild(div4);
await Async_Core_Utility_Sleep(100);
div4.remove();
await Async_Core_Utility_Sleep(100);
div3.appendChild(div4);

resolve();
