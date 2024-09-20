## 2024-09-19

- update packages

**src**

- separate Glob (Bun) and Path (Node) utility into own files and into proper directories
  - Platform/Bun/Glob.ts
  - Platform/Node/Path.ts

**tools**

- update scripts to use new Glob and Path utility logic
- rewrite `build.ts` to use a step system for more control
- update `dev.ts` to use new build step system and add logic for listening to keypresses
- add prettier back in for formatting html/md files
  - /format.ts

## 2024-09-14

**src**

- fix PriorityQueue and BinaryHeap implementations with testing
  - /Abstract Data Type/
  - /Data Structure/
- remove DOM utility files around HTMLElements in favor of Node_Utility.ts
  - /Platform/Web/DOM/Element/\*
  - /Web API/Node_Utility.ts

## 2024-09-13

**src**

- fix potential bug with releasing stream locks
  - /Algorithm/Stream/
- add AsyncReader classes for ReadableStreams
  - /Algorithm/Stream/AsyncReader.ts
- add PathManager class for working with paths
  - /Platform/Bun/Path.ts
- rework PathGroup class to better handle extensions
- add tests for PathGroup and PathManager

**tools**

- add file cache to support incremental builds!
- add BuildRunner class for better bundling with Bun
- update html preprocessor system to use classes
- add new html preprocessor to change script tag src extensions
- rework build and dev scripts for cleaner more efficient flow
- change default sourcemap mode from inline to linked

will update this later if i missed anything

## 2024-09-11

**src**

- add some utility for handling browser api compatability
  - /Web API/
- add utility for superior handling of dom nodes
  - /Web API/Node_Utility.ts
- rework the Store modules a bit
  - /Design Pattern/Observer/Store.ts>)

**tools**

- update debouncing module for better `bun run dev` experience
