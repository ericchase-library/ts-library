import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { Core_JSON_Merge } from '../../../src/lib/ericchase/Core_JSON_Merge.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Builder } from '../../core/Builder.js';
import { JSONC_Parse } from '../../core/bundle/jsonc-parser/parse.js';
import { Logger } from '../../core/Logger.js';

export function Step_Dev_Project_Sync_Config(): Builder.Step {
  return new Class();
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Sync_Config.name;
  channel = Logger(this.StepName).newChannel();

  constructor() {}
  async onStartUp(): Promise<void> {}
  async onRun(): Promise<void> {
    // JSON-based Configs
    await Async_MergeJSONConfigs('.vscode/settings.json');
    await Async_MergeJSONConfigs('.prettierrc');
    await Async_MergeJSONConfigs('package.json');
    await Async_MergeJSONConfigs('tsconfig.json');

    // INI-based Configs
    await Async_MergeINIConfigs('.gitignore');
    await Async_MergeINIConfigs('.prettierignore');
  }
  async onCleanUp(): Promise<void> {}
}

async function Async_MergeJSONConfigs(config_path: string) {
  const base_config = JSONC_Parse((await Async_BunPlatform_File_Read_Text(NODE_PATH.join(Builder.Dir.Tools, 'base-config', config_path))).value ?? '{}');
  const repo_config = JSONC_Parse((await Async_BunPlatform_File_Read_Text(NODE_PATH.join('repo-config', config_path))).value ?? '{}');
  await Async_BunPlatform_File_Write_Text(config_path, JSON.stringify(Core_JSON_Merge(base_config, repo_config), null, 2));
}

async function Async_MergeINIConfigs(config_path: string) {
  const base_config = (await Async_BunPlatform_File_Read_Text(NODE_PATH.join(Builder.Dir.Tools, 'base-config', config_path))).value ?? '';
  const repo_config = (await Async_BunPlatform_File_Read_Text(NODE_PATH.join('repo-config', config_path))).value ?? '';
  const separator = `\n\n##
## Repo Specific
##\n\n`;
  await Async_BunPlatform_File_Write_Text(config_path, base_config.trim() + separator + repo_config.trim());
}
