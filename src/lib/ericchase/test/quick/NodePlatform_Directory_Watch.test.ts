import { describe } from 'bun:test';
import { NodePlatform_Directory_Watch } from '../../NodePlatform_Directory_Watch.js';
import { NodePlatform_SetupTempDirectory } from '../test-setup.js';

NodePlatform_SetupTempDirectory();

describe(NodePlatform_Directory_Watch.name, () => {});
