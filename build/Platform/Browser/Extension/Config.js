import { ReadFile, WriteFile } from '../../Node/Fs.js';

export class Config {
  pojo;
  constructor(pojo) {
    this.pojo = pojo;
  }
  get(key) {
    return this.pojo[key];
  }
  set(key, value) {
    this.pojo[key] = value;
  }
  toJSON() {
    return JSON.stringify(this.pojo);
  }
  static mergeConfigs(configA, configB) {
    function merge_objects(...sources) {
      const dest = {};
      for (const source of sources) {
        if (typeof source !== 'object') {
          continue;
        }
        for (const key in source) {
          if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && Array.isArray(source[key]) === false) {
              dest[key] = merge_objects(dest[key], source[key]);
            } else {
              dest[key] = source[key];
            }
          }
        }
      }
      return dest;
    }
    return new Config(merge_objects(configA.pojo, configB.pojo));
  }
  static async readConfig(path) {
    return new Config(JSON.parse(await ReadFile(path)));
  }
}
export async function GetSemanticVersion(version_json_path) {
  const version = JSON.parse(await ReadFile(version_json_path));
  return `${version.major}.${version.minor}.${version.patch}`;
}
export async function IncrementVersionMajor(version_json_path) {
  const version = JSON.parse(await ReadFile(version_json_path));
  version.major += 1;
  await WriteFile(version_json_path, JSON.stringify(version));
}
export async function IncrementVersionMinor(version_json_path) {
  const version = JSON.parse(await ReadFile(version_json_path));
  version.minor += 1;
  await WriteFile(version_json_path, JSON.stringify(version));
}
export async function IncrementVersionPatch(version_json_path) {
  const version = JSON.parse(await ReadFile(version_json_path));
  version.patch += 1;
  await WriteFile(version_json_path, JSON.stringify(version));
}
