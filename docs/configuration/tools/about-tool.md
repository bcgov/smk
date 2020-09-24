## About Tool

Add a button to the toolbar, that shows a panel with content that taken from the configuration.
It can be used to show any content that the application needs.

<pre>
{ "tools": [ {
    <a href="#type-tool"     >"type"</a>:     "about",
    <a href="#title-tool"    >"title"</a>:    "About SMK",
    <a href="#enabled-tool"  >"enabled"</a>:  false,
    <a href="#icon-tool"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"help"</a>,
    <a href="#order-tool"    >"order"</a>:    1,
    <a href="#position-tool" >"position"</a>: "toolbar",
    <a href="#content-about-tool">"content"</a>:  null
} ] }
</pre>

### `content` (About Tool)
`"content"`: *String* *(OPTIONAL)*  
The content to show in the panel.
This is assumed to be formatted in HTML.
Any styling should be inline in the HTML, or refer to classes that are defined by the enclosing application.

