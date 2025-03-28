## About

https://github.com/ericchase-library/ts-library

This project houses the TypeScript library that I build to make common webdev workflows easier. Everyone is free to use it! I tried to make this comprehensive README file to explain everything about the project. If you have any questions or suggestions, or just want some basic help setting up your dev environment, please feel free to contact me!

You can find the email I use for github on my github profile:

- github @ericchase https://github.com/ericchase

If you want to reach me sooner with modern technology, try discord:

- discord @chaseeric https://discordapp.com/users/208091532648120320
- Zero to Hero https://discord.gg/cXG3KGKuu6
- JavaScript.info https://discord.gg/AuEWpFkfD4

## TypeScript Template Project

For more information about my TypeScript template projects, please visit:

- https://github.com/ericchase-library/ts-template

## Build Tools V2

The build tools were completely rewritten, along with some of the library modules. As of now, the library should be considered on version 2.0.0. It's a work in progress, but should be much more useful than v1.

These build tools use the Biome (https://biomejs.dev/) toolchain for formatting and linting most source files; as well as Prettier (https://prettier.io/) for formatting html and markdown files. Formatting has always been a massive pain point in web dev, and will probably continue to be so. From time to time, I find better tools for formatting files, and the build tools may be updated accordingly.

## Disclaimer

**This project is updated often!**

- Expect breaking changes if you **directly** rely on it!
- Please check the `CHANGELOG.md` file, which may or may not contain recent changes.

**Read the `./tools/build.ts` file before running the build script.**

- The current build script generates a folder named `Project@Template` in the parent directory. This template folder is what users will want to build their new projects from.

I would highly suggest making a copy of the library files per project _instead of_ using git submodules or other similar methods. You can use a sync software like `FreeFileSync` or VSCode extension `Compare Folders` to update the library folder of your projects if needed. Generally, you wouldn't need to do this unless you want an updated version of some module. It takes a little bit of effort, but not much; and I'm sure you'll come to appreciate the process.

- https://freefilesync.org/
- https://marketplace.visualstudio.com/items?itemName=moshfeu.compare-folders
  - insiders: https://marketplace.visualstudio.com/items?itemName=moshfeu.compare-folders-insider

## Developer Environment Setup

I generally recommend VSCode for web development.

**Install the Bun runtime**

- https://bun.sh/

**Install npm dependencies**

```
bun install
```

**Build the project**

For continuous building as you work:

```
bun run dev
```

For final builds:

```
bun run build
```

**Run the Biome linter**

```
bun run lint
```

## Project Structure

### ./src/

This folder contains _all_ of the library files including test files and working examples. If you _just_ want the library files themselves, then clone one of the template projects on GitHub (https://github.com/orgs/ericchase-library/repositories). If you want to build the base template project yourself, you can run the `bun run build` command.

- `bun run build` will create a new directory (named `Project@Template`) in this directory's parent directory.

### ./tools/

This folder contains the scripts we use to automate work flows, like:

- building source code into a website, browser extension, or command line application;
- performing some kind of maintenance on project files;
- and even other operations like:
  - opening all the source files in your project;
  - re-installing all the npm packages in your package.json file; etc.

You can literally do anything you want, which is the point of this library. The scripts should be easy to read, easy to write, and easy to modify. The goal isn't to produce a complete packaged build tool like Gulp, Grunt, Webpack, Makefile, etc. You can use those tools as well! The main idea here is to get away from writing clumsy npm scripts in package.json that rely on other packaged tools.

**Note:**

The scripts under `./tools/` also use modules from this library (from `./src/`). To reiterate, the goal of these scripts is not to produce a package; though, you can do that if you want to! For new projects, you would ideally copy a template project, and customize the `./tools/build.ts` file.

### ./out/

This folder is produced during the normal build process and would contain the final compiled/bundled source code.

For this library project, build tools v1 compiled the TypeScript files into JavaScript files to produce a pure JavaScript library. However, I didn't find the resulting library easy to use. It's much easier to simply copy a template project and build from the TypeScript library instead.

**Note:**

If you want a custom build or bundle, you'll need to modify the `./tools/build.ts` file and potentially write your own processor modules. Compared to build tools v1, this process should be far easier now. The goal, as always, is to be able to do whatever you can think of without restriction. While some things may be extremely difficult or impossible, most things should be doable, and reasonably so.

I periodically release template projects with build scripts for different purposes. Check https://github.com/orgs/ericchase-library/repositories for a template project that you can use. If none of those projects seem to fit your needs, feel free to send me a message.

### ./server/

A local dev server for testing various kinds of projects that utilize a server. The server folder is a separate project with its own repository (https://github.com/ericchase/tool--basic-web-server) that I maintain and update. You could use a different dev server provided by another tool like Vite, or even the VSCode Live Server extension. I prefer writing the server myself, so that's why I include it.

### ./

I've tried to write these files as generic as possible so that you can use them as the base of your new projects.

- .gitignore
- .prettierignore
- .prettierrc
- LICENSE-APACHE
- NOTICE
- biome.json
- package.json
- tsconfig.json

## Copyright & License

**TL;DR:**

> This code is truly free and open source, licensed under the Apache 2.0 License. If you make a copy, _I humbly ask_ that you include the text from the `NOTICE` file somewhere in your project. **_You are not required to!_** You are also not required to include the original `LICENSE-APACHE` or `NOTICE` files, and I would prefer just a copy of the `NOTICE` file text or a link to this repository instead. You can use and modify this code however you like, including using a proprietary license for your changes. The only restriction I maintain is under clause 3 of the Apache 2.0 License regarding patents. If you find any potential license violations within any of my projects, please contact me so that I may resolve them.

---

**Full Disclosure**

- _mission_

The code in this repository will always be truly free and open source (unless I myself have somehow violated an upstream copyright license, in which case I will gladly try to resolve any issues in a timely manner; please email me about any potential license violations you find).

- _please leave a trail_

When making a copy of this project, I _kindly ask_ that you include the text within the `NOTICE` file somewhere (perhaps in your own README.md or LICENSE or NOTICE file?) or a link to this repository so that other users of your project may also be able to find this original template.

```
Typescript Library
https://github.com/ericchase-library/ts-library

Copyright © 2025 ericchase

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

- _your usage of this source code_

That said, this license and copyright notice **DOES NOT** restrict your usage of this template in any way, except for the terms and conditions under clause 3 of the Apache 2.0 License regarding patents: `3. Grant of Patent License.` As you may or may not know, every piece of work is automatically protected and restricted by **copyright** law. The purpose of a **license** is to "unrestrict" the copyright owner's protections under that law, granting others access to use their work. The **patent system**, on the other hand, is a system for **applying restrictions** to the implementation of ideas. Specifically:

> A patent is a type of intellectual property that gives its owner the legal right to exclude others from making, using, or selling an invention for a limited period of time in exchange for publishing an enabling disclosure of the invention. - https://en.wikipedia.org/wiki/Patent

- _patent law_

I don't know enough about patent law to know if this could ever become an issue, but I would rather be safe than sorry. What I do know is that copyright law and patent law are completely separate issues, and copyright law does not protect your work from patents (AFAIK). The Apache 2.0 License does its best to provide some protections from patents of derivative works, which is why I use it for my projects.

- _other terms and conditions_

To reiterate, I hereby informally waive the other terms and conditions under the Apache 2.0 License. You are not required to include the original `LICENSE-APACHE` or `NOTICE` files or text in your derivative work.

- _your derivative works_

As for your own projects, any new additions and/or modifications you make **ARE NOT** subject to my license and copyright notice. You do not need to mention additions and/or modifications to the original source code. You will need to apply your own license and copyright notices if you wish to make your project code open source. If you wish to keep your source code private, you may do so. You may use a proprietary and/or closed source license if you wish. All of this is entirely up to you.

_This is what it means to be truly free and open source._
