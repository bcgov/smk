## Metadata

The configuration metadata is the name of the project, who created it, and where it is in it's lifetime.
The values are controlled by the Admin UI, and there is no reason for the application to change them (except possibly `"name"`).

<pre>
{  
    <a href="#smkid-metadata"      >"smkId"</a>:       "smk-demo-app",  
    <a href="#smkrevision-metadata">"smkRevision"</a>: 1,  
    <a href="#createdby-metadata"  >"createdBy"</a>:   "smk",  
    <a href="#published-metadata"  >"published"</a>:   false,  
    <a href="#name-metadata"       >"name"</a>:        "SMK Demo App",  
    <a href="#project-metadata"    >"project"</a>:     "Demo",  
}
</pre>

### `smkId` (Metadata)
`"smkId"`: *String*  *(REQUIRED)*  
The identifer for the Map Configuration.
Derived from the name, and used by the Admin UI.

### `name` (Metadata)
`"name"`: *String*  *(REQUIRED)*  
The name of the SMK configuration. 
This name is used to identify the configuration in the Admin UI, as well as the title for the script attribute [`smk-title-sel`](./SMK-Client-API.md#smk-title-sel-attribute)

### `project` (Metadata)
`"project"`: *String*  *(OPTIONAL)*  
A optional identifier used to group together related map configurations in the Admin UI.

### `smkRevision` (Metadata)
`"smkRevision"`: *Integer*  *(REQUIRED)*  
The current version of the Map Configuration. This will increment when a version is published and a new edit version created.

### `createdBy` (Metadata)
`"createdBy"`: *String*  *(REQUIRED)*  
The name of the user (BCeID or IDIR) that created this Map Configuration.

### `published` (Metadata)
`"published"`: *Boolean*  *(REQUIRED)*  
If `true`, this project is a published version; otherwise this is an editable, in progress version.

