# smk-client
## Simple Map Kit Client
### A versatile and lightweight toolkit for building a simple web map.

[Repository](https://github.com/bcgov/smk-client)
|
[Docs](https://bcgov.github.io/smk-client/)
|
[Issues](https://github.com/bcgov/smk/issues)

### smk-client Export

This package is a self-contained component for a map.
This package contains map configuration that was built in the SMK admin tool, any data files that were loaded (as KML, SHP or GeoJSON), and the map component itself.

A web application can use this map as simply as this example:

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="smk.js" smk-container-sel="#smk-map-frame" smk-config="map-config.json|?"></script>
    </head>
    <body>
        <div id="smk-map-frame" style="width: 400px; height: 400px"></div>
    </body>
</html>
```

### Testing exported map configuration

If you wish to test this map configuration immediately, this export is packaged with a simple test server.
It uses Grunt, and hence Node.JS.
It is not the only way to serve this code to a web browser, this code could be served via Apache, or any other webserver.

The simple test server requires [NodeJS](https://nodejs.org/en/) to be installed.

Install node modules:

`npm install --production`

Start grunt test server:

`grunt`

Browser will open at [https://localhost:8443](https://localhost:8443).

### Doing development on smk-client

If these is desire to make changes to `smk.js`, the full source code is included in the export in `smk-<version>-src.zip`.

To setup your environment for development, assuming the export is at `/smk-export`:

`cd /smk-export`

Install development libraries

`npm install`

Unzip source code into src/

```
unzip ../smk-<version>-src.zip
cd src
```
Build smk in development mode (unminified) into ../smk.js

`grunt develop`

*OR* build smk in release mode (minified) into ../smk.js

`grunt release` 

See [DEVELOPMENT.md](DEVELOPMENT.md) for more information on doing development on smk-client.
