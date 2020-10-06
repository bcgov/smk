###### [SMK](../..) / [Initialization](.)

# Initializing the Container Selector

This value is a selector that identifies the element that will contain the map.
This selector *must* match exactly one element, otherwise a fatal error occurs.
Usually this will be an id selector like `"#smk-map-frame"`.

##### Note

If the [`smk-container-sel` attribute](#smk-container-sel-attribute) is used with the [`<script>` element](.#initializing-with-script-element), then SMK **CANNOT** be initialized with [`SMK.INIT`](.#initializing-with-smk-init) (an exception will be thrown).


## `smk-container-sel` Attribute

*Required*

Used by the SMK [`<script>` element](#initializing-with-script-element).
Sets the container element selector.

```html
<script src="smk/dist/smk.js"
    smk-container-sel="#smk-map-frame"
></script>
```


## `containerSel` Option

*Required*

Used by [`SMK.INIT`](..#initializing-with-smk-init).
Sets the container element selector.

```javascript
SMK.INIT( {
    containerSel: '#smk-map-frame'
} )
```
