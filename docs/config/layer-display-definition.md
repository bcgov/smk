## Layer Display Definition

The layer display defines how the layers configured for the map are organized when shown in the [`"layers"`](#layers-tool) tool).
This configuration allows layers to be organized into folders, which can be nested arbitrarily.
Layers can also be put together into groups, which behave as a single layer, and don't expose their internal structure to user.
This configuration will also control the order in which layers are painted on the map, the top-most layer in this configuration is drawn on top of all other layers.

There are 3 types of objects that make up the layer display definition:

- [Display Layer](#display-layer)
- [Display Folder](#display-folder)
- [Display Group](#display-group)


