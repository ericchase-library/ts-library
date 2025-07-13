// import { Core_Error_Fix_Call_Stack_Async } from './Core_Error_Fix_Call_Stack_Async.js';
// import { NODE_FS, NODE_PATH } from './NodePlatform.js';

// export async function NodePlatform_File_Delete_Async(path: string): Promise<boolean> {
//   path = NODE_PATH.normalize(path);

//   try {
//     await NODE_FS.promises.access(path, NODE_FS.constants.F_OK);
//   } catch (error) {
//     /** If `path` is NOT accessible, we need not do anything else. */
//     return true;
//   }

//   if (recursive === false) {
//     await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rmdir(path));
//   } else {
//     await Core_Error_Fix_Call_Stack_Async(Error().stack, NODE_FS.promises.rm(path, { recursive: true, force: true }));
//   }

//   try {
//     await NODE_FS.promises.access(path, NODE_FS.constants.F_OK);
//     /** If `path` is accessible, deletion failed. */
//     return false;
//   } catch (error) {
//     /** If `path` is NOT accessible, deletion succeeded. */
//     return true;
//   }
// }
