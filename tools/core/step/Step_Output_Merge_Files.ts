import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { Core_JSON_Merge } from '../../../src/lib/ericchase/Core_JSON_Merge.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Async_NodePlatform_File_Delete } from '../../../src/lib/ericchase/NodePlatform_File_Delete.js';
import { Builder } from '../../core/Builder.js';
import { JSONC } from '../../core/bundle/jsonc-parse/jsonc-parse.js';
import { Logger } from '../../core/Logger.js';

/**
 * This step processes files in `Builder.Dir.Out` only. Ensure that all config
 * paths are relative to that folder.
 */
export function Step_Output_Merge_Files(...configs: Config[]): Builder.Step {
  return new Class(configs);
}

class Class implements Builder.Step {
  StepName = Step_Output_Merge_Files.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(readonly configs: Config[]) {}
  async onStartUp(): Promise<void> {
    for (const config of this.configs) {
      for (let i = 0; i < config.merge_files.length; i++) {
        config.merge_files[i] = NODE_PATH.join(Builder.Dir.Out, config.merge_files[i]);
      }
      config.out_file = NODE_PATH.join(Builder.Dir.Out, config.out_file);
    }
  }
  async onRun(): Promise<void> {
    for (const config of this.configs) {
      switch (config.type) {
        case 'json':
          {
            const data_list: any[] = [];
            // read merge files
            for (const path of config.merge_files) {
              const { error, value } = await Async_BunPlatform_File_Read_Text(path);
              if (value !== undefined) {
                data_list.push(JSONC.parse(value));
              } else {
                throw error;
              }
            }
            const data = Core_JSON_Merge(...data_list);
            this.channel.log(`Merge ${config.merge_files.map((_) => `"${_}"`).join(', ')}`);
            await config.modify?.(data);
            // delete merge files
            for (const path of config.merge_files) {
              await Async_NodePlatform_File_Delete(path);
              this.channel.log(`Delete "${path}"`);
            }
            // write output file
            await Async_BunPlatform_File_Write_Text(config.out_file, JSON.stringify(data, null, 2).trim() + '\n');
            this.channel.log(`Write "${config.out_file}"`);
          }
          break;
        case 'text':
          {
            const text_list: any[] = [];
            // read merge files
            for (const path of config.merge_files) {
              const { error, value } = await Async_BunPlatform_File_Read_Text(path);
              if (value !== undefined) {
                text_list.push(value.trim());
              } else {
                throw error;
              }
            }
            const text = text_list.join('\n\n');
            this.channel.log(`Merge ${config.merge_files.map((_) => `"${_}"`).join(', ')}`);
            // delete merge files
            for (const path of config.merge_files) {
              await Async_NodePlatform_File_Delete(path);
              this.channel.log(`Delete "${path}"`);
            }
            // write output file
            await Async_BunPlatform_File_Write_Text(config.out_file, text + '\n');
            this.channel.log(`Write "${config.out_file}"`);
          }
          break;
      }
    }
  }
}
type Config =
  | {
      /**
       * For `type` `json`, later files are merged on top of earlier files.
       */
      type: 'json';
      /**
       * Merged files are deleted on successful merging.
       */
      merge_files: string[];
      /**
       * Out file is overwritten on successful merging.
       */
      out_file: string;
      modify?: (data: any) => Promise<void> | void;
    }
  | {
      /**
       * For `type` `text`, later files are appended to bottom of output file.
       */
      type: 'text';
      /**
       * Merged files are deleted on successful merging.
       */
      merge_files: string[];
      /**
       * Out file is overwritten on successful merging.
       */
      out_file: string;
    };
