## About

This project houses the TypeScript library that I use on a day-to-day basis (yes, daily). Everyone is free to use it! I tried to make this comprehensive README file to explain everything about the project. If you have any questions or suggestions, or just want some basic help setting up your dev environment, please feel free to contact me!

You can find the email I use for github on my github profile:

- github @ericchase https://github.com/ericchase

If you want to reach me sooner with modern technology, try discord:

- discord @chaseeric https://discordapp.com/users/208091532648120320
- Zero to Hero https://discord.gg/cXG3KGKuu6
- JavaScript.info https://discord.gg/AuEWpFkfD4

## Massive Disclaimer

**This library is updated often!**

- Expect breaking changes if you **directly** rely on it!

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

For one off builds:

```
bun run build
```

**Format the source code**

```
bun run format
```

## Project Structure

### ./src/

This folder contains _all_ of the library files including test files and working examples. If you _just_ want the library files themselves, then run the `bun run strip` command to copy all of the `./src/**/*.ts` files into the `./src-stripped/` folder. You can view the script in `./tools/strip.ts`. It's a simple script that can help you learn how to write your own automation scripts.

### ./build/

This folder is produced during the build process and contains the final compiled source code.

For this project, the TypeScript files are compiled into JavaScript files for a pure JavaScript library solution. Generally, you should prefer using the TypeScript files; but sometimes you can't.

**Note:**

The resulting files are not bundles. They are JavaScript files using the ES6 module system. Some files rely on Bun and Node, and will not simply work when imported into a website. For websites, you need properly bundled code. Depending on your requirements, you may require different kinds of bundlers. Vite is a well known popular frontend tool that uses Rollup and esbuild for bundling. These are great for certain kinds of projects.

If you want a custom build or bundle, then you'll need to work with the configuration files to make that happen. This can become very complicated and difficult quickly. It also means your project is dependent on those tools, and indirectly dependent on how Node and npm work. With Bun, things are different. You can write tools that don't depend on Node and npm at all, letting you do things that cannot normally be done when using popular editors like VSCode that also depend on Node and npm and how they work.

If you can't think of why you might need to use hand written build tools, that's ok! You don't _need_ to use any of the build tools in this project. You can use whichever tools you want. In fact, you can probably easily combine these hand written scripts with other popular tools and harness more power than your peers who only rely on packaged tools. The power is yours!

### ./tools/

This folder contains the scripts we use to automate work flows, like:

- building source code into a website, browser extension, or command line application;
- performing some kind of maintenance on project files;
- and even other operations like:
  - opening all the source files in your project (`./tools/open-all-source-files.ts`);
  - re-installing all the npm packages in your package.json file (`./tools/re-install-packages.ts`)

You can literally do anything you want, which is the point of this library. These scripts should be easy to read, easy to write, and easy to modify. The goal isn't to produce a complete packaged build tool like Gulp, Grunt, Webpack, Makefile, etc. You can use those tools as well! The main idea here is to get away from writing clumsy npm scripts in package.json that rely on other packaged tools.

**Note:**

The scripts under `./tools/` also use modules from this library (from `./src/`). To reiterate, the goal of these scripts is not to produce a package; though, you can do that if you want to! For new projects, you would ideally copy the library files from `./src/` (or `./src-stripped/` if you don't want the test files and example) into your project's `./src/lib/ericchase/` folder (you can use `ericchase` to distinguish that the folder is from this library, or choose whatever folder name you want), then update the import statements in your project's copy of `./tools/` to match the new location. This is already done for you in the various `ts-templates-` repositories.

### ./

I've tried to write these files as generic as possible so that you can use them as the base of your new projects.

- .gitignore
- .prettierignore
- .prettierrc
- LICENSE-APACHE
- NOTICE
- package.json
- tsconfig.json

## Copyright & License

**TL;DR:**

> This code is truly free and open source, licensed under the Apache 2.0 License. If you make a copy, **I humbly ask** that you include the text from the `NOTICE` file somewhere in your project. **_You are not required to!_** You are also not required to include the original `LICENSE-APACHE` or `NOTICE` files, and I would prefer just a copy of the `NOTICE` file text or a link to this repository instead. You can use and modify this code however you like, including using a proprietary license for your changes. The only restriction I maintain is under clause 3 of the Apache 2.0 License regarding patents. If you find any potential license violations, please contact me so that I may resolve them.

---

**Full Disclosure**

- _mission_

The code in this repository will always be truly free and open source (unless I myself have somehow violated an upstream copyright license, in which case I will gladly try to resolve any issues in a timely manner; please email me about any potential license violations you find).

- _please leave a trail_

When making a copy of this project, I _kindly ask_ that you include the text within the `NOTICE` file somewhere (perhaps in your own README.md or LICENSE or NOTICE file?) or a link to this repository so that other readers of your project may also be able to find this original template.

```
Template Website
https://github.com/ericchase-library/ts-templates-website

Copyright © 2024 ericchase

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
