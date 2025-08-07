## About

https://github.com/ericchase-library/ts-library

This project houses the TypeScript library that I build to make common webdev workflows easier. Everyone is free to use it! I tried to make this comprehensive README file to explain everything about the project. If you have any questions or suggestions, or just want some basic help setting up your dev environment, please feel free to contact me!

You can find the email I use for github on my github profile:

- github @ericchase https://github.com/ericchase

If you want to reach me sooner with modern technology, try discord:

- discord @chaseeric https://discordapp.com/users/208091532648120320
- Zero to Hero https://discord.gg/cXG3KGKuu6
- JavaScript.info https://discord.gg/AuEWpFkfD4

## Build Tools V4

Once again, the build tools and library have been completely rewritten, after a failed attempt at v3. In fact, almost everything has since been rewritten. As of now, all the template projects should be using build tools and library v4.

### Template Project Update System

I maintain a slew of template projects to help you get to work faster. You can find these projects at https://github.com/orgs/ericchase-library/repositories. The idea is that I can work on this TypeScript-Library project to improve my build tools and library APIs separately from the templates. When improvements are ready to ship, I update each and every template project accordingly. Manually, this is a rather time consuming endeavor. To make updating efficient, I've written a few helper systems.

There are some steps under `tools/core-dev` that can sync files between two project folders. `Step_Dev_Project_Sync_Core` syncs the folders under `tools` and everything under `src/lib/ericchase`. `Step_Dev_Project_Sync_Server` syncs the developer `server` folder, which I have found to be quite useful for almost every kind of project.

`Step_Dev_Project_Update_Config` runs some logic that merges files from `tools/base-config` with files in `repo-config`. It takes the resulting merges and updates the corresponding project config files with them. This might be confusing at first, but it has some important use cases.

- None of the files under `repo-config` will be changed automatically from running Bun update.
- This both forces you and lets you manually maintain a list of your project dependencies.
- It also lets me modify reasonable base config settings without you having to do the merging yourself.
- And of course, if you want to disable this process entirely, just remove `Step_Dev_Project_Update_Config` from `Builder.SetStartUpSteps` in `tools/build.ts`. You are already expected to modify this file at least once when setting up your projects, so it fits well into the developer flow.

### Code Formatting

The most important use case for code formatting is code review through version control (git). Every project should have a formatter set up that can be easily run through a command. The command could run an npm package or a custom formatting scripts. It doesn't matter how it does it, as long as it does it.

Beyond that, code formatting is secondly a way to make the code base easier to read for the developer. As long as you diligently run the project formatter before committing changes, you are free to format the code temporarily however you like! And I encourage you to do so, because the more familiar the code is to you, the easier it will be to read and write for you.

That said, while I hate the `Prettier` formatter, it has been the most consistent and reliable formatter for web development since I have started this project. I have tried others, like `Biome`; but I always run into a new problem every week or month when I do. So for now, I'm sticking to `Prettier` until something better comes along.

## Project Disclaimer

**This project is updated often!**

- Expect breaking changes if you **directly** rely on it!
- Please check the `CHANGELOG.md` file, which may or may not contain recent changes.
- Most users should instead use one of the template projects as a base.

**Read the `./tools/build.ts` file before running the build script.**

- The build script for this project attempts to update a second, hard-coded folder at `C:/Code/Base/JavaScript-TypeScript/@Template`, which exists on **_my_** machine, but extremely unlikely to exist on **_your_** machine. If you want to work on this project like I do, then you'll need to set up a folder structure similar to mine. You can find that folder structure at https://github.com/ericchase/code-base-template. This project would be in `@Library` while the base template project would be in `@Template`.

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

## Project Structure

### ./docs/

Some light documentation for various parts of the build tools.

### ./out/

This folder is produced during the normal build process and would contain the final compiled/bundled source code.

For this library project, the TypeScript under `./src/lib` is transpiled into JavaScript to produce a pure JavaScript library that you could probably use directly. However, this is a TypeScript library, and you are meant to use the TypeScript files for development.

**Note:**

If you want a custom build or bundle, you'll need to modify the `./tools/build.ts` file and potentially write your own Processor and Step modules for any new functionality. Compared to the original build tools iteration, this process should be fairly easy. The goal, as always, is to be able to do whatever you can think of without restriction. While some things may be difficult or impossible, most things should be doable, and reasonably so.

Check https://github.com/orgs/ericchase-library/repositories for pre-built template projects. If none of those projects seem to fit your needs, feel free to send me a message.

### ./repo-config/

Folder used by my config file update system. If desired, you can manually maintain project specific config settings here, and use the update system to merge with base config settings. More information can be found in an earlier section.

### ./server/

This is a local dev server I wrote for live testing project code. The server folder is a separate project with its own repository at https://github.com/ericchase/tool--basic-web-server. It has its own config files and package dependencies that I maintain and update when needed. Of course, you could also use a different dev server tool like `Vite` or the `Live Server` extension for VSCode. I prefer writing and using my own server, so that's why I include it.

### ./src/

This folder contains _all_ of the library API files including test files. Please rely on the tests cases for examples. If you _just_ want the library files themselves, then clone one of the template projects from https://github.com/orgs/ericchase-library/repositories.

### ./tools/

This folder contains the scripts we use to automate work flows, like:

- building source code into a website, browser extension, or command line application;
- performing some kind of maintenance on project files;
- and even other operations like:
  - opening all the source files in your project;
  - re-installing all the npm packages in your package.json file; etc.

You can literally do anything you want, which is the point of this library. The scripts should be easy to read, easy to write, and easy to modify. The goal isn't to produce a complete packaged build tool like Gulp, Grunt, Webpack, Makefile, etc. You can use those tools as well! The main idea here is to get away from writing clumsy npm scripts in package.json that rely on other packaged tools.

**Note:**

The scripts under `./tools/` also use modules from this library (from `./src/lib`). To reiterate, the goal of these scripts is not to produce a package; though, you can do that if you want to! For new projects, you would ideally clone one of the template project mentioned above, and customize the `./tools/build.ts` file how you see fit.

### ./

You may create whatever config files your project needs, but here is the list of miminally required ones:

- .gitignore
- .prettierignore
- .prettierrc
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
