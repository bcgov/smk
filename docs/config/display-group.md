## Display Group

<pre>
{
    <a href="#id-display-group"        >"id"</a>:         "group1",
    <a href="#type-display-group"      >"type"</a>:       "group",
    <a href="#title-display-group"     >"title"</a>:      "Group 1",
    <a href="#isvisible-display-group" >"isVisible"</a>:  true,
    <a href="#items-display-group"     >"items"</a>:      [ ... ],
}
</pre>

### `id` (Display Group)
`"id"`: *String* *(OPTIONAL)*  
The id of the group, which must be unique.

### `type` (Display Group)
`"type"`: *String* *(REQUIRED)*  
The type must be `"group"`.

### `title` (Display Group)
`"title"`: *String* *(REQUIRED)*  
The title to show for the group. 

### `isVisible` (Display Group)
`"isVisible"`: *Boolean* *(OPTIONAL)*  
If the group is to be visible initially.
Default is `true`.

### `items` (Display Group)
`"items"`: *Array[Object]* *(REQUIRED)*  
The [layer display objects](#layer-display-definition) that are contained in the group.
