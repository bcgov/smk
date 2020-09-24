## Display Folder

<pre>
{
    <a href="#id-display-folder"        >"id"</a>:         "folder1",
    <a href="#type-display-folder"      >"type"</a>:       "folder",
    <a href="#title-display-folder"     >"title"</a>:      "Folder 1",
    <a href="#isvisible-display-folder" >"isVisible"</a>:  true,
    <a href="#isexpanded-display-folder">"isExpanded"</a>: false,
    <a href="#items-display-folder"     >"items"</a>:      [ ... ],
}
</pre>

### `id` (Display Folder)
`"id"`: *String* *(OPTIONAL)*  
The id of the folder, which must be unique.

### `type` (Display Folder)
`"type"`: *String* *(REQUIRED)*  
The type must be `"folder"`.

### `title` (Display Folder)
`"title"`: *String* *(REQUIRED)*  
The title to show for the folder. 

### `isVisible` (Display Folder)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
If the folder is to be visible initially.
Default is `true`.

### `isExpanded` (Display Folder)
`"isExpanded"`: *Boolean* *(OPTIONAL)*  
If the folder is to be expanded initially
Default is `false`.

### `items` (Display Folder)
`"items"`: *Array[Object]* *(REQUIRED)*  
The [layer display objects](#layer-display-definition) that are contained in the folder.


