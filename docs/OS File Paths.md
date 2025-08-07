Some important things I've learned while writing build tools v4.

**Path Separators**

- on `Windows`, the `node:path` APIs treat the `/` slash and `\` backslash both as path separators.
- on `Linux` and `macOS`, the `node:path` APIs treat the `/` slash as a path separator; whereas, the `\` backslash is considered a valid path character and **_not_** a path separator.

i.e.: on `Linux` and `macOS`, `dir\file.ext` is _an entire filename_, not a directory and file path. you would be **_gravely mistaken_** to assume that `dir\file.ext` and `dir/file.ext` are the same thing.

**Root Path**

- on `Windows`, paths that start with the root character (`/` or `\`) are considered absolute paths of the current working drive, which can be found with `process.cwd()`. typically, that would be the `C:/` drive.

**Prefix and Suffix**

- on `Windows`, the `node:path` APIs usually strip the leading `.` from relative paths and the trailing slash (`/` or `\`) from absolute and relative paths.
- on `Linux` and `macOS`, however, the `node:path` APIs usually leave paths alone. this inconsistency **_will_** eventually cause problems, which is why I wrote my `NodePlatform_PathObject_Absolute_Class` and `NodePlatform_PathObject_Relative_Class` library files.
