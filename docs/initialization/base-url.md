###### [SMK](..) / [Initialization](.)

# Initializing the Base URL

The Base URL is what resources used by SMK used to resolve their relative URLs when they are loaded.
This value defaults to base path of `smk.js` that is loaded by the `src` of the containing `<script>` element.


## `smk-base-url` Attribute

*Not required, default is base path of `smk.js`*

Used by the SMK [`<script>` element](#initializing-with-script-element).
Sets the base URL for SMK resources.

```html
<script src="smk/dist/smk.js"
    smk-container-sel="#smk-map-frame"
    smk-base-url="smk/dist"
></script>
```


## `baseUrl` Option

*Not required, default is base path of `smk.js`*

Used by [`SMK.INIT`](..#initializing-with-smk-init).
Sets the base URL for SMK resources.

```javascript
SMK.INIT( {
    containerSel: '#smk-map-frame',
    baseUrl:      'smk/dist'
} )
```
