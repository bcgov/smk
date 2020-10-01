###### [SMK](..) / [Configuration](.)

# Metadata

The configuration metadata is the name of the project, who created it, and when.
These values are set when the smk application is created using the `smk create` tool.

Click on a property name for more information.
<pre>
{
    <a href="#name-property"        >"name"</a>:        "SMK App",
    <a href="#createdby-property"   >"createdBy"</a>:   "smk developer",
    <a href="#createddate-property" >"createdBy"</a>:   "2020-07-23T19:18:25.876Z"
    <a href="#version-property"     >"version"</a>:     "1.0.0"
}
</pre>

## Name Property
`"name": String`

The name of the SMK configuration.
This name is set when the SMK application is created with the `smk create` tool.
It is displayed in the `smk edit` tool, and the [`"version"` tool](), but it is otherwise not used by the map.


## CreatedBy Property
`"createdBy": String`

The name of the person who created the SMK application using the `smk create` tool.
It is displayed in the `smk edit` tool, and the [`"version"` tool](), but it is otherwise not used by the map.

## CreatedDate Property
`"createdDate": String`

The timestmap when the SMK application was created using the `smk create` tool.
It is displayed in the `smk edit` tool, and the [`"version"` tool](), but it is otherwise not used by the map.

## Version Property
`"version": String`

The version of the SMK library that this configuration is intended for.
The version of the SMK library was selected when the application created using the `smk create` tool.
