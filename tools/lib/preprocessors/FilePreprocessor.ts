import type { Path, PathGroup } from 'lib/ericchase/Platform/Node/Path.js';
import type { SyncAsync } from 'lib/ericchase/Utility/Types.js';

export interface FilePreprocessor {
  pathMatches(path: Path | PathGroup): boolean;
  preprocess(bytes: Uint8Array, path_group: PathGroup): SyncAsync<{ bytes: Uint8Array }>;
}
