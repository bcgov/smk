# smk-client
## Simple Map Kit Client
### A versatile and lightweight toolkit for building a simple web map.

[Repository](https://github.com/bcgov/smk-client)
|
[Docs](https://bcgov.github.io/smk-client/)
|
[Issues](https://github.com/bcgov/smk/issues)

**smk-client** is designed to make it easy to integrate a map into a web application.

The application only needs to include one `<script>` tag to load the library, and define a single `<div>` tag to contain the map.
There is no other code for the application to write, the map functionality is defined completely by a JSON configuration structure.

Here is an example of a complete HTML page that uses smk-client to show a map:

```html
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <script src="smk.js" smk-container-sel="#smk-map-frame"></script>
        <style>
            #smk-map-frame { position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: 0; padding: 0; }
        </style>
    </head>
    <body id="smk-map-frame"></body>
</html>
```

The [client API](https://bcgov.github.io/smk-client/SMK-Client-API) details how the application interacts with the map. 
The interaction is via attributes on the `<script>` tag, and/or parameters passed to the page in the URL.
There are [examples](https://bcgov.github.io/smk-client/SMK-Client-API-Examples) of the various ways the map can be configured.

The [configuration](https://bcgov.github.io/smk-client/SMK-Client-Configuration) controls all aspects of the map.

Creating the configuration by hand is tedious, for most uses it is easier to use the **smk-admin** tool.
The smk-admin tool lets you edit the configuration in an interactive UI, and lets you test the map in a demo application.
When you satisfied with the map, you can ask smk-admin to generate an export package that contains the smk-client library along with the configuration.
This export package can be easily integrated into an application.

See [EXPORT.md](EXPORT.md) for more information on working with export packages.

See [DEVELOPMENT.md](DEVELOPMENT.md) for more information on doing development on smk-client.

# License
```
Copyright 2018 Province of British Columbia

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
