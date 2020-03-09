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

    > cd projects/smk-client

    # Install node modules:
    > npm install

    # Change to src directory
    > cd src

    # Build smk in development mode (unminified) into ../smk.js
    > grunt develop 

    # *OR* Build smk in release mode (minified) into ../smk.js
    > grunt release 

    # Change back to root of project
    > cd ..

    # Start test server to serve code:
    > grunt 

Point browser at [https://localhost:8443](https://localhost:8443).

It's possible to have the code automatically rebuild when changes are saved:

    > cd projects/smk-client/src

    # Build smk in development mode (unminified) into ../smk.js, then wait for changes to trigger a rebuild.
    > grunt develop watch

In another console window:

    > cd projects/smk-client

    # Start test server to serve code:
    > grunt 

### Code Organization

**TBD**
