import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { Core_JSON_Merge } from '../../../src/lib/ericchase/Core_JSON_Merge.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Builder } from '../../core/Builder.js';
import { JSONC } from '../../core/bundle/jsonc-parse/jsonc-parse.js';
import { Logger } from '../../core/Logger.js';

export function Step_Dev_Project_Update_Config(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_Dev_Project_Update_Config.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly config: Config) {}
  async onStartUp(): Promise<void> {}
  async onRun(): Promise<void> {
    // JSON-based Configs
    await Async_MergeJSONConfigs(this.config.project_dir, '.vscode/settings.json');
    await Async_MergeJSONConfigs(this.config.project_dir, '.prettierrc');
    await Async_MergeJSONConfigs(this.config.project_dir, 'package.json');
    await Async_MergeJSONConfigs(this.config.project_dir, 'tsconfig.json');

    // INI-based Configs
    await Async_MergeINIConfigs(this.config.project_dir, '.gitignore');
    await Async_MergeINIConfigs(this.config.project_dir, '.prettierignore');

    // Fix Known Conflicts
    await Async_RemoveDuplicatePackages(this.config.project_dir);
  }
  async onCleanUp(): Promise<void> {}
}
interface Config {
  project_dir: string;
}

async function Async_MergeJSONConfigs(project_path: string, config_path: string) {
  const base_config = JSONC.parse((await Async_BunPlatform_File_Read_Text(NODE_PATH.join(project_path, Builder.Dir.Tools, 'base-config', config_path))).value ?? '{}');
  const repo_config = JSONC.parse((await Async_BunPlatform_File_Read_Text(NODE_PATH.join(project_path, 'repo-config', config_path))).value ?? '{}');
  await Async_BunPlatform_File_Write_Text(NODE_PATH.join(project_path, config_path), JSON.stringify(Core_JSON_Merge(base_config, repo_config), null, 2).trim() + '\n');
}

async function Async_MergeINIConfigs(project_path: string, config_path: string) {
  const base_config = (await Async_BunPlatform_File_Read_Text(NODE_PATH.join(project_path, Builder.Dir.Tools, 'base-config', config_path))).value?.trim() ?? '';
  const repo_config = (await Async_BunPlatform_File_Read_Text(NODE_PATH.join(project_path, 'repo-config', config_path))).value?.trim() ?? '';
  const separator = '\n\n## Project Specific\n\n';
  await Async_BunPlatform_File_Write_Text(NODE_PATH.join(project_path, config_path), (base_config + separator + repo_config).trim() + '\n');
}

async function Async_RemoveDuplicatePackages(project_path: string) {
  const path = NODE_PATH.join(project_path, 'package.json');
  const package_json = JSONC.parse((await Async_BunPlatform_File_Read_Text(path)).value?.trim() ?? '');
  const dependency_set = new Set(Object.keys(package_json.dependencies ?? {}));
  for (const key of Object.keys(package_json.devDependencies ?? {})) {
    if (dependency_set.has(key)) {
      delete package_json.devDependencies[key];
    }
  }
  await Async_BunPlatform_File_Write_Text(path, JSON.stringify(package_json, null, 2).trim() + '\n');
}
