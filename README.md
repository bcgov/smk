**Simple Map Kit**

![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)

*A versatile and lightweight toolkit for building a simple web map.*

Simple Map Kit (SMK) is designed to make it easy to integrate a map into a web application.

Simple Map Kit is not an application itself; it's a JavaScript library that can be added to a web page that, in combination with an SMK configuration file, adds mapping functionality.

# Basic SMK Application

An SMK application needs to include one `<script>` tag to load the library, define a single `<div>` tag to contain the map, and call one method to initialize the map. No other code needs to be written for the application; map functionality is defined in a JSON configuration file, though custom functionality can be added with additional code.

Here is an example of an HTML page that uses SMK to show a map:

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

# SMK-CLI

Creating SMK configuration by hand is possible, but an easier way to create a simple SMK application is to use the command-line development tool [SMK CLI](https://github.com/bcgov/smk-cli).
This tool lets you initialize a new SMK map application project by answering a few questions.
It also gives you an interactive web-based UI to do more detailed configuration of your map, and it showcases BC government map layers that you can include in your application.

# Examples

To see some samples of SMK in action, you can look at the [debug folder](https://bcgov.github.io/smk/debug).

# [Documentation](https://bcgov.github.io/smk/)
- [Installation](https://bcgov.github.io/smk/docs/installation)
- [Initialization](https://bcgov.github.io/smk/docs/initialization)
- [Configuration](https://bcgov.github.io/smk/docs/configuration)
- [Examples](https://bcgov.github.io/smk/docs/examples)
- [Development](https://bcgov.github.io/smk/docs/development)

# [License](LICENSE)