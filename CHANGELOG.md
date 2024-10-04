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
