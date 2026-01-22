###### [SMK](..)

# Installing SMK

There are a variety of ways to install Simple Map Kit (SMK) into your application.

## Use SMK-CLI

If you want to create a new application using SMK, then the easiest way is with [`smk-cli`](https://github.com/bcgov/smk-cli) (Command Line Interface), a utility for assisting with the creation, modification and development of SMK projects.

For more information on creating and editing apps with `smk-cli` [visit the docs](https://bcgov.github.io/smk-cli/).

## Install from NPM

In your NPM project, use this command to add SMK as a dependency:

`npm install @bcgov/smk`

Then, in your application you add the SMK library like this:

`<script src="node_modules/@bcgov/smk/dist/smk.js"></script>`

## Download

Click one of the download links to left to download the most recent build of SMK.
After unzipping the package, you should copy the `dist` folder to your project.

Then in your application, you could include SMK like this (assuming you copied `dist` to `assets/js/smk`):

`<script src="assets/js/smk/smk.js"></script>`

## Use deployed version

Include this in your application:

`<script src="[url of smk deployment]/smk.js"></script>`