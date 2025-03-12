new caching system

- store older structure, file names, file last modification times, and hashes of files in memory and periodically update database
- update locking cache to handle arbitrary locks instead of scripts
  - LockOrExit
  - LockOrFail
  - LockOrThrow

build steps

- add folder under tools lib for individual build steps
- develop module plugin system so users of different projects can update the steps incrementally, along with custom user settings

build tools data

- create an object to hold all the data used during the build process
- let different projects update the data accordingly along with custom user settings
- revamp the output folder system to incorporate build steps. they could be called `build_phase_0` etc

watch mode

- create folder under tools lib for different watchers of source, build, and temporary folders

processors

- rewrite processor system to allow pre and post processors separately
- implement system to determine each version of output path for individual files depending on build steps and processors

library additions

- Node Fs functions that catch errors and ignore them
- Bun Fs conversion functions for file.stream to Readable
- ConsoleLogWithDate | ConsoleErrorWithDate
  - only outputs time string

# rejected

configurations

- add folder under tools lib
- incremental building of configuration files via json merging
- let users add custom properties to configs
- add configs to cache system
- add vscode settings to lock the final configs? or throw error if final configs doesn't match cached hash?
- Biome
- prettier rc, ignore
