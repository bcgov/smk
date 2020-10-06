###### [SMK](../..)

# Initializing SMK

There are 2 ways to initialize SMK in your application.

The first way is using the [`<script>` element](#initializing-with-script-element).
This method is simple and limited, and is not reccommeded.
It is supported for legacy purposes, and will probably not be supported in a later version.

The second way is using [`SMK.INIT`](#initializing-with-smk-init).
This method gives you much control over how SMK is initialized, and is the recommended method for using SMK.

Before you can initialize SMK, it must be installed in your codebase. See [Installation](installation) for tips on installing SMK's code in your application.


## Initializing With `<script>` element

The easiest way to add SMK to your application, requiring you to add one `<script>` element, and one `<div>` element.
The `<script>` element loads the `smk.js` library, which is then initialized using attributes from the `<script>` element.
These are the attributes that can be provided in the `<script>` element:

- [`smk-container-sel`](container-sel#attribute)
- [`smk-config`](config#attribute)
- [`smk-id`](id#attribute)
- [`smk-base-url`](base-url#attribute)

If you are initializing SMK from the `<script>` element, then the [`smk-container-sel` attribute](#smk-container-sel-attribute) is required, all other attributes are optional.

This is an example `<script>` element using all the SMK attributes.

```html
<script src="smk/dist/smk.js"
    smk-container-sel="#smk-map-frame"
    smk-config="map-config.json|?"
    smk-base-url="smk/dist"
    smk-id="my-map"
></script>
```

##### Note

If the [`smk-container-sel` attribute](#smk-container-sel-attribute) is present, then SMK **CANNOT** be initialized with [`SMK.INIT`](#smk-init) (it will throw an exception).

If you need to have more than one instance of the map in your application, then you will have to include the SMK `<script>` element for each map, with, at least, a different [`smk-container-sel` attribute](#smk-container-sel-attribute).


## Initializing With `SMK.INIT`

This is the best, and most flexible way to initialize SMK.
The SMK library only needs to be loaded once, but `SMK.INIT` can be called as many times as necessary.

It is probably best to load SMK in the `<head>` element, then later in the `<body>` place the script to call `SMK.INIT`:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>SMK Application</title>
        <script src="smk/dist/smk.js"></script>
        ....other stuff....
    </head>
    <body>
        ....other stuff....
        <div id="smk-map-frame"></div>
        <script>
            SMK.INIT( {
                containerSel: '#smk-map-frame'
            } )
        </script>
    </body>
</html>
```

### SMK.INIT Method

##### Arguments

`SMK.INIT( option )`
- `option: Object` - an object that can contain these keys:

    - [`containerSel`](container-sel#option)
    - [`config`](config#option)
    - [`id`](id#option)
    - [`baseUrl`](base-url#option)

##### Return value

A [Promise](https://wiki.developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to the `smkMap` object when the map is finished initialization.
An error during initialization will cause the the promise to reject.

##### Example

```javascript
SMK.INIT( {
        containerSel:   '#smk-map-frame'
        config:         [ 'smk-config.json', '?' ],
        baseUrl:        'smk/dist'
        id:             'my-map'
    } )
    .then( function ( smk ) {
        // do something with smk object
        // smk === SMK.MAP[ 'my-map' ]
    } )
    .catch( function ( error ) {
        // smk initialization failed
    } )
```


