**Simple Map Kit**

![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)

*A versatile and lightweight toolkit for building a simple web map.*

*SMK* is designed to make it easy to integrate a map into a web application.

The application needs to include one `<script>` tag to load the library, define a single `<div>` tag to contain the map, and call one method to initialize the map.
There is no other code for the application to write, the map functionality is defined completely by a JSON configuration structure.

Here is an example of a complete HTML page that uses SMK to show a map:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SMK Demo</title>
        <script src="smk.js"></script>
        <style>
            #smk-map-frame {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0; margin: 0; padding: 0;
            }
        </style>
    </head>
    <body>
        <div id="smk-map-frame"></div>
        <script>
            SMK.INIT( { containerSel: '#smk-map-frame' } )
        </script>
    </body>
</html>
```

## [Documentation](https://bcgov.github.io/smk/)

### [Installation](https://bcgov.github.io/smk/docs/installation)
### [Initialization](https://bcgov.github.io/smk/docs/initialization)
### [Configuration](https://bcgov.github.io/smk/docs/configuration)
### [Examples](https://bcgov.github.io/smk/docs/examples)
### [Development](https://bcgov.github.io/smk/docs/development)

Creating the configuration by hand is possible, but an easier way to create a simple SMK application is to use the command-line development tool [SMK CLI](https://github.com/bcgov/smk-cli).
This tool lets you initialize a new SMK map application project by answering a few questions.
It also gives you an interactive web-based UI to do more detailed configuration of your map.

To see some samples of SMK in action, you can look at the [debug folder](https://bcgov.github.io/smk/debug).

# License
```
Copyright 2025 Province of British Columbia

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
