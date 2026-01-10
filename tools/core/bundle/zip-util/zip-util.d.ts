import { default as NODE_FS_SYNC } from 'node:fs';
declare class Class_Instance {
  /**
   * The actual adm-zip instance. Cast as `any` to strip out import dependencies from the resulting declaration file.
   */
  instance: any;
  constructor(fs?: typeof NODE_FS_SYNC);
  /**
   * Allows you to directly create a directory entry in the archive.
   *
   * @param internal_path - a path that is created within the archive itself
   * @param options
   * @param options.attr - optional number as unix file permissions; or, a filesystem Stats object
   * @param options.comment - optional file comment
   *
   * @returns technically, an adm-zip `IZipEntry` in case you want to do something advanced; for typical usage, this should be ignored
   */
  createDirectory(
    internal_path: string,
    options?: {
      attr?: number | object;
      comment?: string;
    },
  ): any;
  /**
   * Allows you to directly create a file entry in the archive.
   *
   * @param internal_path - a path that is created within the archive itself
   * @param content - file content as buffer; or, utf8 encoded string
   * @param options
   * @param options.attr - optional number as unix file permissions; or, a filesystem Stats object
   * @param options.comment - optional file comment
   *
   * @returns technically, an adm-zip `IZipEntry` in case you want to do something advanced; for typical usage, this should be ignored
   */
  createFile(
    internal_path: string,
    content: Buffer | string,
    options?: {
      attr?: number | object;
      comment?: string;
    },
  ): any;
  /**
   * Adds a directory's nested files and nested directories from disk to the archive.
   *
   * @param path - path to the directory to add
   * @param options
   * @param options.filter - optional `RegExp` or function to match files to be included. if a function is provided, the function will be called with a file path as its sole argument, and the returned boolean indicates whether the file should be included or ignored
   * @param options.internal_path - optional directory path within the archive itself to place the nested files and directories
   * @param options.namefix - optional function to help fix filenames. can provide the text `latin1` to run a built-in namefix function
   */
  async_addDirectory(
    path: string,
    options?: {
      filter?: RegExp | ((path: string) => boolean);
      internal_path?: string;
      namefix?: string | ((name: string) => string);
    },
  ): Promise<void>;
  /**
   * Adds a file from disk to the archive.
   *
   * @param path - path to the file to add
   * @param options
   * @param options.comment - optional file comment
   * @param options.internal_name - optional name for the file being added
   * @param options.internal_path - optional directory path within the archive itself to place the file
   */
  async_addFile(
    path: string,
    options?: {
      comment?: string;
      internal_name?: string;
      internal_path?: string;
    },
  ): Promise<void>;
  /**
   * Writes the newly created archive to disk at the specified location.
   *
   * @param output_path - the file path where the archive will be written to disk
   * @param options
   * @param options.attr - optional number as unix file permissions
   * @param options.overwrite - if the file already exists at the target path, the file will be overwriten if this is true. defaults to `true`
   */
  async_writeZip(
    output_path: string,
    options?: {
      attr?: number;
      overwrite?: boolean;
    },
  ): Promise<boolean>;
}
export declare namespace ZIP_UTIL {
  /**
   * Extract a zip archive via file path or in-memory buffer.
   *
   * @param input - zip archive as buffer; or, a path to a zip archive on disk
   * @param output_path - the file path where the archive's contents will be written to disk
   * @param options
   * @param options.fs_module - optional filesystem module of the runtime you are using. defaults to node:fs
   * @param options.keep_original_attr - the file will be created with the permission from the entry if this is true. defaults to `false`
   * @param options.overwrite - if the file already exists at the target path, the file will be overwriten if this is true. defaults to `false`
   */
  function Async_Extract(
    input: Buffer | string,
    output_path: string,
    options?: {
      fs_module?: any;
      keep_original_attr?: boolean;
      overwrite?: boolean;
    },
  ): Promise<void>;
  /**
   * Create a limited adm-zip instance for building and writing a zip archive to file.
   *
   * @param options
   * @param options.fs_module - optional filesystem module of the runtime you are using. defaults to node:fs
   */
  function CreateInstance(options?: { fs_module?: any }): Class_Instance;
}
export {};
