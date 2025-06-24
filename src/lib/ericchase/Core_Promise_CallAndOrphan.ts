import { Core_Promise_Orphan } from './Core_Promise_Orphan.js';

export function Core_Promise_CallAndOrphan(asyncfn: () => Promise<any> | any): void {
  /** Annotate a function call as purposely un-awaited. */
  Core_Promise_Orphan(asyncfn());
}
