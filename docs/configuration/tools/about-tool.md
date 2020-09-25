## About Tool


Add a button to the toolbar, that shows a panel with content that is taken from the configuration.
It is typically used show a panel of information about the application.

<pre>
{ "tools": [ {
    <a href="#type"     >"type"</a>:     "about",
    <a href="#title"    >"title"</a>:    "About SMK",
    <a href="#enabled"  >"enabled"</a>:  false,
    <a href="#icon"     >"icon"</a>:     <a href="https://material.io/tools/icons/?icon=help" target="material">"help"</a>,
    <a href="#order"    >"order"</a>:    1,
    <a href="#position" >"position"</a>: "toolbar",
    <a href="#content"  >"content"</a>:  null
} ] }
</pre>

{% include_relative _include/tool-base.html %}

### content
`"content"`: *String* *(OPTIONAL)*
The content to show in the panel.
This is assumed to be formatted in HTML.
Any styling should be inline in the HTML, or refer to classes that are defined by the enclosing application.

