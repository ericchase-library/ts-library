# Source File

All files under the `src` directory of the project directory, excluding files under the `src/lib` directory, are considered source files. During the build process, these files will be analyzed and cached. The original file text will not be altered. Instead, the cached copy of the text will be modified through the use of build processors, and the resulting modified text will be written to a file under the `out` directory after all processors have finished running.

# Build Process

Processors are run one at a time. They are given access to a cache object of the source files, and are allowed to modify the cached text of any file in the cache object.

Source files might depend on other source files, such that when one file's text is updated, other files may need to be processed again. To accomplish this, the cache object must keep track of a set of dependencies for each source file. A file's dependency set must be properly updated by each processor.

When a file that has dependencies is updated, the dependencies must be processed again. Since processors are run in order, dependencies will have to be run in the next batch.

# HTML Custom Component

A custom component is an html file located under `src/lib/components`. The file name can be used in source html files as a custom element tag. The custom component processor will replace these custom element tags with an element created from the custom component html during the build process. Any attributes from the tag will be copied over to the element as best as possible. Each custom component may include a `slot` tag for which any child elements of the custom element tag will be transferred. If there is no slot tag provided, any child elements will be transferred to the custom component's outermost element.

Custom components may be nested. To handle nesting, all custom component files must be read and then processed like source files.

When a custom component file is updated, it must be processed like a source file again.
