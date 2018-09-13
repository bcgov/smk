# smk-client
## Simple Map Kit Client
### A versatile and lightweight toolkit for building a simple web map.

[Repository](https://github.com/bcgov/smk-client)
|
[Docs](https://bcgov.github.io/smk-client/)
|
[Issues](https://github.com/bcgov/smk/issues)

### smk-client Development

Clone this repo, let's say into `projects/smk-client`.

Install [NodeJS](https://nodejs.org/en/).

Install Grunt command line interface

    > npm install -g grunt-cli

Install node modules:

    > cd projects/smk-client
    > npm install

Start Grunt in development mode:

    > grunt

Point browser at [https://localhost:8443](https://localhost:8443).

Edit code, and when a file is saved, the website is automatically reloaded.

The configurations in `example/config` are available to any of the pages at [https://localhost:8443](https://localhost:8443).
Use a URL parameter like `config=config/bcparks-test.json`.

### Running Grunt

This project uses [Grunt](https://gruntjs.com/) to build the code for development or release.
Grunt can also be used to run webserver hosting the code that is built, and automatically rebuild when the code is changed on disk.

The simplest way to use Grunt is:

    > grunt

This will build the code, and if there no build errors, it will start a webserver, and wait for changes to trigger a rebuild.
The application will be hosted at [https://localhost:8443](https://localhost:8443).
This is equivalent to starting grunt this way:

    > grunt mode:dev use:https

The options for the `mode` parameter are `dev` and `release`.

In `dev` mode, the code is loaded as-is in the browser, no minification or coalescing is performed.
This mode makes debugging issues relatively easy.

In `release` mode, the code is minified and compacted into a single file.
It should be functionally the same, but it loads faster.
It is not easy to debug.

The options for the `use` parameter are `https` and `http`.
The `https` port is 8443 and the `http` port is 8888.
The `https` server uses a self-signed cert, so the browser will complain that it is not secure.
Normally the `http` server isn't used.

To get a build of the code without starting the web server:

    > grunt mode:release build

The code will be built into the `build` directory.
`mode:dev` will work as well.

### Code Organization

**TBD**
