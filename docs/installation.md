###### [SMK](..)

# Installing SMK

There are a variety of ways to install Simple Map Kit (SMK) into your application.

## Use `smk create` to make a new app

If you want to create a new application using SMK, then the easiest way is with the [`smk-cli`](https://github.com/bcgov/smk-cli) (Command Line Interface), a utility for assisting with the creation, modification and development of SMK projects.

The following instructions will get you up and running, but for more information on creating and editing apps with `smk-cli` [visit the docs](https://bcgov.github.io/smk-cli/).

### Installing `smk-cli`

`smk-cli` makes use of the Node.js JavaScript runtime and the Node Package Manager (NPM). If this is not already installed, please [download](https://nodejs.org/en/download/) and install it.

First make sure that the `smk-cli` is installed globally in your machine:

    > npm install --global @bcgov/smk-cli

Test that this worked:

    > smk help

You should see the help information for `smk-cli`. If you don't and are on Windows, then it's likely your npm folder (`%APPDATA%\npm`) is not part of the system PATH variable. The simplest way to add it is with the [GUI](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/). After adding the npm folder to path, `> smk help` should work.

### Creating a project
Change to the a directory where you keep your projects, and create a new SMK application (change `my-new-app` to whatever you like).

    > cd projects
    > smk create my-new-app

You will be asked some questions about your new application.
Once they are answered you will have a new skeleton application at `projects/my-new-app`.

You will also be asked whether you want to edit the app. Choosing yes will launch the interactive editor.

To run the app locally at any time, navigate to the app directory and call:

    > npm run view

## Install from NPM

In your NPM project, use this command to add SMK as a dependency:

    > npm install @bcgov/smk

Then, in your application you add the SMK library like this:

    <script src="node_modules/@bcgov/smk/dist/smk.js"></script>


## Download

Click one of the download links to left to download the most recent build of SMK.
After unzipping the package, you should copy the `dist` folder to your project.

Then in your application, you could include SMK like this (assumeing you copied `dist` to `assets/js/smk`):

    <script src="assets/js/smk/smk.js"></script>


## Use deployed version

Include this in your application:

    <script src="[url of smk deployment]/smk.js"></script>


