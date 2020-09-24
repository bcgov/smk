## Select Unique Layer Query Parameter

Use a select parameter to provide a value to the [query predicate](#layer-query-predicate) that comes from the user picking a value from a drop-down list.
The drop-down list is populated dynamically from the layer by finding all unique values for [uniqueAttribute]().
If the request to populate the drop-down fails, the drop-down field changes to an input field.
The [choices](#choices-select-layer-query-parameter) property may be used as well to provide a fall-back. 

**DO NOT** use this parameter type if you know the number of unique values will be more than a few hundred.

<pre>
{ "layers": [ { "id": "fish-points", queries: [ { "id": "species", parameters: [ {
    <a href="#id-layer-query-parameter"                        >"id"</a>:              "species-name",
    <a href="#title-layer-query-parameter"                     >"title"</a>:           "Species Code",            
    <a href="#type-layer-query-parameter"                      >"type"</a>:            "select-unique",
    <a href="#uniqueattribute-select-unique-layer-query-parameter">"uniqueAttribute"</a>: "SPECIES_CODE"
} ] } ] } ] }
</pre>

### `uniqueAttribute` (Select Layer Query Parameter)
`"uniqueAttribute"`: *Array[Object]* *(REQUIRED)*  
The name of the attribute on the layer that will be queried to find all unique values.

