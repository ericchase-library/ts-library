import { WebPlatform_Node_Reference_Class } from '../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { WebPlatform_Utility_Get_Closest_Common_Ancestor } from '../lib/ericchase/WebPlatform_Utility_Ancestor_Node.js';

const target1 = WebPlatform_Node_Reference_Class(document.querySelector('#target-1')).as(HTMLDivElement);
const target2 = WebPlatform_Node_Reference_Class(document.querySelector('#target-2')).as(HTMLDivElement);
const target3 = WebPlatform_Node_Reference_Class(document.querySelector('#target-3')).as(HTMLDivElement);

console.log(WebPlatform_Utility_Get_Closest_Common_Ancestor(target1, target2, target3));
console.log(WebPlatform_Utility_Get_Closest_Common_Ancestor(target2, target3));
