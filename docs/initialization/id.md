###### [SMK](..) / [Initialization](.)

# Initializing the Map ID

This is a unique identifier for SMK map object.
It is generated automatically if it is not specified.
If you need to refer to a specific instance of the map (a specific key of `SMK.MAP`), then you may want to set this value.
If this value is set to `"my-map"`, then the map object will be available at `SMK.MAP[ "my-map" ]`.

## `smk-id` Attribute

*Not required*

Used by the SMK [`<script>` element](#initializing-with-script-element).
Sets the unique identifier for the map object.

```html
<script src="smk/dist/smk.js"
    smk-container-sel="#smk-map-frame"
    smk-id="my-map"
></script>
```


## `id` Option

*Not required*

Used by [`SMK.INIT`](..#initializing-with-smk-init).
Sets the unique identifier for the map object.

```javascript
SMK.INIT( {
    containerSel: '#smk-map-frame',
    id:           'my-map'
} )
```
