## 2025-05-26

- removed namespaces from library files
  - updated build tool files
- removing biome.js from project, going back to prettier
  - i constantly have issues with biome, both with the language server and extension. it's just not ready for power devs
- removed `Processor_Basic_Writer` in favor of `Processor_Set_Writable`
  - the new processor allows finer control over which files should and shouldn't be written
  - each file is written after its "first-run" processing phase if writable, regardless of modification
  - all modified, writable files are written after each normal processing phase
- restructured Builder.ts for readability
- fixed a few bugs here and there
- separate library public api from library internal api

## 2025-05-03

### ~~Releasing beta version of build tools v3.~~

Update: That was a short life for v3. Bundler's are unable to perform tree-shaking on typescript namespaces. So we are going back to the whiteboard.

Version 2 didn't work out. For version 3, I am focusing on simplicity and cutting down the number of files. I've also experimented with bundling external packages and writing typescript wrappers around them.

The first completed bundle wraps `css-select` and `htmlparser2`, along with their indirect dependencies. The bundle and declaration files (along with license notices) can be found under `tools/lib-web/bundle/htmlutil.d.ts`. I will eventually put the projects that build the bundles online.

### New Library Structure

**src/lib/ericchase/core.ts**

- I've merged all the modules I've written that are commonly used in my projects under a single namespace called `Core`. The structure I've developed cuts down on library files and import statements.
- I will continue writing unit tests when I have time.

**src/lib/ericchase/platform-bun.ts**
**src/lib/ericchase/platform-node.ts**
**src/lib/ericchase/platform-web.ts**

- Each JavaScript runtime/platform have their own individual file with their own namespaces like `BunPlatform`, `NodePlatform`, `WebPlatform`. The API is extremely minimal; I only include functions that are used in my projects. I will add more functionality over time.
- Testing these modules is a much more difficult task.

### New Build Tools Structure

**tools/core**

- Similar to the new library structure, this structure focuses on less files and less import statements. The bulk of the build system can be found in `Builder.ts`. The caching and logging system I came up with are in `Cacher.ts` and `Logger.ts`.
- All other functionality can be found in Processor and Step files. Many of these files are in this folder; but I have also started grouping files together under individual `lib-` folders, based on functionality.

**tools/build.ts**

- As before, this is the main file you, the user, will be interested in. I've put a ton of effort in keeping this file as short and concise as possible. There are still improvements to be made, but I've done as much as I can think of for now.

## 2025-03-12

### Releasing beta version of build tools v2.

The build tools were completely rewritten, along with some of the library modules. The next phase will be beta testing the new build tools and writing test for anything untested.

**src/lib/ericchase/Platform**

- I've started rewriting the platform modules for Bun and Node to make it easier to switch between them and/or add new runtimes.
- The old Path module has been deprecated in favor of the `CPath` class under `FilePath.ts`
- The GlobScanner module is being replaced with the `globMatch` and `globScan` utility functions under `util.ts`. The new CPath class makes it easier to manage groups of paths without the complex modules.

There are some new files and fixes here and there. I'll try to come up with a better system for outlining changes in the future. Please read the `README.md` for more information on the v2 changes.

## 2024-10-17

- fix: bundling `*.module.ts` files had a flaw in that the Bun bundler does not correct import paths for other imported `*.module.ts` files. to work around this, i added the `tools/lib/preprocessors/FilePreprocessor_ImportModuleRemapper.ts` processor and import aliases in `tsconfig.json`. this library project does not bundle anything, so it did not need this fix. this fix is for the template projects, which will need to utilize both the import aliases for `*.module.ts` under `src`, along with the `ImportModuleRemapperPreprocessor` class when copying bundles from `tmp_dir` to `out_dir`
- remove some unused and buggy properties from the `Path` class. use `origin_path` and `relative_path` instead:
  - readonly origin_dir: string; // includes root, but not dir
  - readonly root: string;
  - readonly relative_dir: string; // does not include root
  - readonly relative_base: string; // includes name and ext
  - readonly relative_name: string;
  - readonly relative_ext: string;
- renamed the `...Entry` functions in `FileSystemEntryIterator` and `DataTransferItemIterator` classes to `...Entries`

## 2024-10-04

- add more test cases
- add tests for public and private apis of library

**src**

/Platform/Node/Path.ts

- rename SanitizePath to SanitizeFileName
  - this function should be used on file names, not entire paths

/Utility/Assert.ts

- add assert functions for `typeof` checks

/Utility/Console.ts

- update console functions to use the new UpdateMarker utility classes
  - see below

/Utility/Debounce.ts

- remove the `Debouncer` class in favor of `Debounce` and `ImmediateDebounce` functions
  - these functions don't return values from their inner function. if you want to handle return values, setup a variable for storing the values instead of returning them from the inner function.
  - these functions can handle synchronous and asynchronous inner functions. `Debounce` always defers, so its call is always asynchronous. `ImmediateDebounce` may synchronously call the inner function. see test cases for examples

/Utility/Defer.ts

- add helper function Defer
  - see example in Debounce functions where this is being used

/Utility/HelpMessage.ts

- add utility class to handle help message debouncing for shell programs

/Utility/UpdateMarker.ts

- add utility classes for arbitrary update tracking
  - check the `updated` property of markers returned from `getNewMarker`
  - see Console.ts for example
  - if you want to subscribe to an observable, use the Store or Handler design patterns instead

**tools**

- update tools to use new Debounce functions
- rename hot_reload.ts to hotreload.ts

> **all module changes**

```
= Platform/Node/Path.ts
  - SanitizePath
  + SanitizeFileName

+ Utility/Assert.ts
  + AssertBigint
  + AssertBoolean
  + AssertFunction
  + AssertNumber
  + AssertObject
  + AssertString
  + AssertSymbol
  + AssertUndefined

= Utility/Console.ts
  - GetConsoleMark
  + GetConsoleMarker

= Utility/Debounce.ts
  - Debouncer
  + Debounce
  + ImmediateDebounce
  + LeadingEdgeDebounce

+ Utility/Defer.ts
  + Defer

+ Utility/HelpMessage.ts
  + HelpMessage

= Utility/TextCodec.ts
  - DecodeText
  + DecodeBytes

+ Utility/UpdateMarker.ts
  + UpdateMarker
  + UpdateMarkerManager
```

## 2024-10-02

**src**

- modify modules to utilize Path and PathGroup classes over strings
  - src/lib/ericchase/Platform/Bun/Fs.ts
  - src/lib/ericchase/Platform/Bun/Glob.ts
  - src/lib/ericchase/Platform/Node/HTML Processor/TemplateProcessor.ts
  - src/lib/ericchase/Platform/Node/Fs.ts
  - src/lib/ericchase/Platform/Node/Path.ts
  - src/lib/ericchase/Platform/Node/Watch.ts

**tools**

- modify tools to utilize Path and PathGroup classes over strings
- move `format.ts` script into `tools/lib`

> **all module changes**

```
+ Utility/Console.ts
  + ConsoleErrorWithDate
  + ConsoleLogWithDate
```

## 2024-09-30

- move modules around for better folder structures
- deprecate the Cxx modules
- update .gitignore, package.json, tsconfig.json

**src**

- add more utilities
  - JSON utility functions
  - new Handler class
  - file running functions (needs better api)
  - stdin readers
  - menu and shell menu classes
  - PrepareHelpMessage function
  - assertion functions
  - string manipulation functions
  - console utility functions
  - GeneratorArray class

**tools**

- complete overhaul of the dev system
  - fix handling of the file modification cache
  - add locking system to prevent running different build scripts at the same time
  - add capability to interact with dev script, (`q` to quit and `r` to restart watcher, `b` for full rebuild)
  - many bug fixes

> **all module changes**

```
+ Algorithm/Array.ts
  + ArrayAreEqual
  + ArrayBufferToBytes
  + ArrayChunks
  + ArrayEndpoints
  + ArrayShuffle
  + ArraySplit

- Algorithm/Debounce.ts
  - Debouncer

+ Algorithm/JSON.ts
  + JSONGet
  + JSONStringifyAll

+ Algorithm/Math.ts
  + Midpoint

- Algorithm/Sleep.ts
  - Sleep

+ Algorithm/Stream.ts
  + AsyncLineReader
  + AsyncReader
  + U8StreamCompare
  + U8StreamReadAll
  + U8StreamReadSome
  + U8StreamReader

+ Algorithm/Uint32Array.ts
  + Uint32ToHex

+ Algorithm/Uint8Array.ts
  + U8
  + U8Clamped
  + U8Concat
  + U8Copy
  + U8FromString
  + U8FromUint32
  + U8Split
  + U8Take
  + U8TakeEnd
  + U8ToASCII
  + U8ToDecimal
  + U8ToHex
  + U8ToLines
  + U8ToString

- Algorithm/Array/Array.ts
  - ArrayEquals
  - ArrayGetBytes
  - ArrayShuffle
  - ArraySplit

- Algorithm/Array/Chunk.ts
  - GenerateChunkSlices
  - GenerateChunks

- Algorithm/Array/Comparison.ts
  - AreEqual

- Algorithm/Array/Endpoints.ts
  - Endpoints

= Algorithm/Array/SlidingWindow.ts
  - GenerateSlidingWindowFilter
  + SlidingWindow
  + SlidingWindowFilter

- Algorithm/Array/Uint32Array.ts
  - Uint32ToHex

- Algorithm/Array/Uint8Array.ts
  - U8
  - U8Clamped
  - U8Concat
  - U8Copy
  - U8FromString
  - U8FromUint32
  - U8Split
  - U8Take
  - U8TakeEnd
  - U8ToASCII
  - U8ToDecimal
  - U8ToHex

+ Algorithm/JSON/Analyze.ts
  + JSONAnalyze

= Algorithm/JSON/Merge.ts
  - MergeJSON
  + JSONMerge

- Algorithm/Math/Midpoint.ts
  - midpoint

- Algorithm/Stream/AsyncReader.ts
  - AsyncLineReader
  - AsyncReader

- Algorithm/Stream/Compare.ts
  - U8StreamCompare
  - U8StreamReader

- Algorithm/Stream/ReadAll.ts
  - U8StreamReadAll

- Algorithm/Stream/ReadSome.ts
  - U8StreamReadSome

- Algorithm/String/Convert/Case.ts
  - ToSnakeCase

- Algorithm/String/Search/GlobSearch.ts
  - GlobSearch

+ Algorithm/String/Search/WildcardMatcher.ts
  + MatchAny

+ Design Pattern/Handler.ts
  + HandlerCaller
  + HandlerSet

+ Design Pattern/Chain of Responsibility/ChainedHandler.ts
  + ChainedHandlerCaller

- Platform/Browser/Extension/Config.ts
  - Config
  - GetSemanticVersion
  - IncrementVersionMajor
  - IncrementVersionMinor
  - IncrementVersionPatch

+ Platform/Bun/Child Process.ts
  + Run
  + RunSync
  + Spawn
  + SpawnSync

+ Platform/Bun/Fs.ts
  + MoveFile

= Platform/Bun/Glob.ts
  - GlobManager
  + GlobScanner

- Platform/Bun/Process.ts
  - Run
  - RunQuiet

- Platform/Cxx/LSD.ts
  - FilterDirectoryListing
  - FilterDirectoryTree
  - IterateLSD
  - LSD
  - PathKind

- Platform/Cxx/Watch.ts
  - Watch

+ Platform/Node/Path.ts
  + ResolvePath
  + SanitizePath

= Platform/Node/Process.ts
  - PipeStdio
  - Run
  + StdinByteReader
  + StdinRawModeReader
  + StdinReader
  + StdinTextReader

+ Platform/Node/Shell.ts
  + KEYS
  + Shell

+ Platform/Node/HTML Processor/ParseHTML.ts
  + ParseHTML

+ Platform/Node/HTML Processor/TemplateProcessor.ts
  + LoadHtmlFile
  + LoadIncludeFile
  + ProcessTemplateFile
  + ProcessTemplateNode
  + RegisterIncludeSource
  + SaveHtmlFile

- Platform/Web/HTML/ParseHTML.ts
  - ParseHTML

- Platform/Web/HTML/TemplateProcessor.ts
  - LoadHtmlFile
  - LoadIncludeFile
  - ProcessTemplateFile
  - ProcessTemplateNode
  - RegisterIncludeSource
  - SaveHtmlFile

+ Utility/Assert.ts
  + AssertEqual
  + AssertNotEqual

+ Utility/Console.ts
  + ConsoleErrorToLines
  + ConsoleLogToLines
  + ConsoleNewline
  + GetConsoleMark

+ Utility/Debounce.ts
  + Debouncer

+ Utility/GeneratorArray.ts
  + GeneratorArray

+ Utility/Menu.ts
  + IsMenu
  + IsMenuItem
  + MenuNavigator
  + ParseMenu

+ Utility/PrepareMessage.ts
  + PrepareMessage

+ Utility/ShellMenu.ts
  + ShellMenu

+ Utility/Sleep.ts
  + Sleep

+ Utility/String.ts
  + GetLeftMarginSize
  + LineIsOnlyWhiteSpace
  + RemoveWhiteSpaceOnlyLinesFromTopAndBottom
  + Split
  + SplitLines
  + SplitMultipleSpaces
  + SplitMultipleWhiteSpace
  + ToSnakeCase
  + TrimLines

+ Utility/TaskRepeater.ts
  + TaskRepeater

+ Utility/TextCodec.ts
  + DecodeText
  + EncodeText
```

## 2024-09-21

- update packages
- update biome config
  - set linter "noDoubleEquals" to "off"

**src/Algorithm/Array**

- add `ArrayShuffle`
- use performant loops in some U8 functions

**src/Algorithm/Math**

- use BigInt in `Factorial` function
  - add test cases
- remove `SelfCartesianProduct`
  - use `nChooseRCombinations(..., 2)` instead
- rewrite `ConsecutiveCartesianProduct` as `nCartesianProduct` with performant logic
  - this performs Cartesian product on multiple arrays
- rewrite each Combinatoric function with performant logic
  - fix up test cases

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
