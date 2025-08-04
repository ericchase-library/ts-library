export class Class_WebPlatform_File_CompatClass {
  file;
  constructor(file) {
    this.file = file;
  }
  get relativePath() {
    return this.file.relativePath ?? this.file.webkitRelativePath ?? undefined;
  }
}
export function WebPlatform_File_CompatClass(file) {
  return new Class_WebPlatform_File_CompatClass(file);
}
