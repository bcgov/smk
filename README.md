*A versatile and lightweight toolkit for building a simple web map.*

**SMK** is designed to make it easy to integrate a map into a web application.

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

The [client API](https://bcgov.github.io/smk/docs/SMK-Client-API) details how the application interacts with the map.
There are [examples](https://bcgov.github.io/smk/docs/SMK-Client-API-Examples) of the various ways the map can be configured.
The [configuration](https://bcgov.github.io/smk/docs/SMK-Client-Configuration) controls all aspects of the map.

Creating the configuration by hand is possible, but an easier way to create a simple SMK application is to use the command-line development tool [SMK CLI](https://github.com/bcgov/smk-cli). 
This tool lets you initialize a new SMK map application project by answering a few questions.
It also gives you an interactive web-based UI to do more detailed configuration of your map.

If you would like to fork and do your own development on it, take a look at the [developer documentation](https://bcgov.github.io/smk/docs/development.md).

To see some samples of SMK in action, you can look at the [debug folder](debug).

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
