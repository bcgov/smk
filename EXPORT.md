# smk-client
## Simple Map Kit Client
### A versatile and lightweight toolkit for building a simple web map.

[Repository](https://github.com/bcgov/smk-client)
|
[Docs](https://bcgov.github.io/smk-client/)
|
[Issues](https://github.com/bcgov/smk/issues)

### smk-client Export

### Testing exported map configuration

Install [NodeJS](https://nodejs.org/en/).

Install Grunt command line interface

    > npm install -g grunt-cli

Install node modules:

    > npm install

Start grunt test server:

    > grunt

Browser will open at [https://localhost:8443](https://localhost:8443).

### Doing development on smk-client

If you need to make changes to `smk.js`, the full source code is included in the export in `smk-<version>-development.zip`.

To setup your environment for development, assuming the export is at `/smk-export`:

    > cd /smk-export
    > mkdir dev
    > cd dev
    > unzip ../smk-<version>-development.zip 
    > cp ../map-config.json src
    > cp ../attachments/* example/attachments
    > npm i
    > grunt

See [DEVELOPMENT.md](DEVELOPMENT.md) for more information on doing development on smk-client.
