###### [SMK](..)

# SMK Examples

## Assumptions

For the following examples, the reader should assume the following:

- There is a site at **https://example.com/demo**, this will be the base for the URLs used below.
    This site contains the following directory structure.
<pre>
    demo
    |-- index.html
    |-- smk-config.json
    |-- victoria.json
    |-- kamloops.json
    |-- wms-layer.json
    |-- wms-layer-attributes.json
    |-- wms-layer-query.json
    |-- smk.js
    '-- images
        '-- (SMK images)
</pre>

- `index.html`
  (take careful note of the comment in the code):

```html
<html>
    <head>
        <title></title>
        <!-- ------------------------------------------------
            The examples specify the SMK <script> element
            that is to be inserted here.
        ------------------------------------------------- -->
        <style>
            #smk-map-frame {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;

                margin: 0;
                padding: 0;
            }
        </style>
    </head>

    <body id="smk-map-frame"></body>
</html>
```

- `smk-config.json`
```json
{
    "version": 1.0.4,
    "name": "Test App",
    "createdBy": "vivid",
    "createdDate": "2021-08-06T17:12:57.858Z",
    "viewer": {
        "type": "leaflet",
        "baseMap": "Streets",
        "esriApiKey": "<your-ESRI-API-key>"
    },
    "tools": [
        {
            "type": "markup",
            "enabled": false
        },
        {
            "type": "baseMaps",
            "enabled": true
        }
    ],
    "layers: []
}
```

- `victoria.json`
```json
{
    "viewer": {
        "location": {
            "extent": [ -124.0750, 48.3087, -123.2273, 48.7519 ]
        }
    }
}
```

- `kamloops.json`
```json
{
    "viewer": {
        "location": {
            "extent": null,
            "center": [ -120.38298432016748, 50.677415757969214 ],
            "zoom": 11
        }
    }
}
```

- `wms-layer.json`
```json
{
    "layers": [
        {
            "id": "whse-tantalis-ta-crown-leases-svw",
            "type": "wms",
            "serviceUrl": "https://openmaps.gov.bc.ca/geo/pub/wms",
            "title": "Lease Applications - Tantalis - Colour Filled",
            "layerName": "WHSE_TANTALIS.TA_CROWN_LEASES_SVW",
            "styleName": "Lease-Applications-Tantalis-Colour-Filled",
            "isVisible": true
        }
    ]
}
```

- `wms-layer-attributes.json`
```json
{
    "layers": [
        {
            "id": "whse-tantalis-ta-crown-leases-svw",
            "titleAttribute": "INTRID_SID",
            "geometryAttribute": "SHAPE",
            "attributes": [
                { "id": "intrid-sid", "name": "INTRID_SID", "title": "Intrid Sid" },
                { "id": "disposition-transaction-sid", "name": "DISPOSITION_TRANSACTION_SID", "title": "Disposition Transaction Sid" },
                { "id": "tenure-stage", "name": "TENURE_STAGE", "title": "Tenure Stage" },
                { "id": "tenure-status", "name": "TENURE_STATUS", "title": "Tenure Status" },
                { "id": "tenure-type", "name": "TENURE_TYPE", "title": "Tenure Type" },
                { "id": "tenure-subtype", "name": "TENURE_SUBTYPE", "title": "Tenure Subtype" },
                { "id": "tenure-purpose", "name": "TENURE_PURPOSE", "title": "Tenure Purpose" },
                { "id": "tenure-subpurpose", "name": "TENURE_SUBPURPOSE", "title": "Tenure Subpurpose" },
                { "id": "crown-lands-file", "name": "CROWN_LANDS_FILE", "title": "Crown Lands File" },
                { "id": "tenure-document", "name": "TENURE_DOCUMENT", "title": "Tenure Document" },
                { "id": "tenure-expiry", "name": "TENURE_EXPIRY", "title": "Tenure Expiry" },
                { "id": "tenure-location", "name": "TENURE_LOCATION", "title": "Tenure Location" },
                { "id": "tenure-legal-description", "name": "TENURE_LEGAL_DESCRIPTION", "title": "Tenure Legal  Description" },
                { "id": "tenure-area-derivation", "name": "TENURE_AREA_DERIVATION", "title": "Tenure Area Derivation" },
                { "id": "tenure-area-in-hectares", "name": "TENURE_AREA_IN_HECTARES", "title": "Tenure Area In Hectares" },
                { "id": "responsible-business-unit", "name": "RESPONSIBLE_BUSINESS_UNIT", "title": "Responsible Business  Unit" },
                { "id": "code-chr-stage", "name": "CODE_CHR_STAGE", "title": "Code Chr Stage" }
            ]
        }
    ]
}
```

- `wms-layer-query.json`
```json
{
    "viewer": {
        "activeTool": "query--whse-tantalis-ta-crown-leases-svw--query1",
    },
    "tools": [
        {
            "type": "query",
            "instance": "whse-tantalis-ta-crown-leases-svw--query1",
            "onActivate": "execute",
        }
    ],
    "layers": [
        {
            "id": "whse-tantalis-ta-crown-leases-svw",
            "queries": [
                {
                    "id": "query1",
                    "title": "Tenure Status",
                    "description": "Find features for a given Tenure Status",
                    "parameters": [
                        {
                            "id": "param1",
                            "type": "constant",
                            "value": "ACCEPTED"
                        }
                    ],
                    "predicate": {
                        "operator": "and",
                        "arguments": [
                            {
                                "operator": "equals",
                                "arguments": [
                                    {
                                        "operand": "attribute",
                                        "name": "TENURE_STATUS"
                                    },
                                    {
                                        "operand": "parameter",
                                        "id": "param1"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
```

- `smk.js`
The production version of the SMK library.
[smk.js](https://bcgov.github.io/smk/dist/smk.js)

The examples will provide a setup that gives the `<script>` element and the parameters for URL that is being requested.
The URL parameters (if any) are presented in a list for ease of reading, and the [`URL`]() is linked to the properly formatted URL.

The complete request is formatted as a standard URL (though without any spaces around ? and &):

> [host and path] **?** [argument1] **&** [argument2] **&** ... **&** [argumentN]


If multiple setups are provided for an example, it is asserted that they all have exactly the same effect.



## Example 1

Using default configuration.

### Setup 1A
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo)

### Result 1

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: directions, location, markup, and search.
- Map is centered over BC, showing whole province.
- The base map is 'Topographic'.

### Discussion 1

The `<script>` element doesn't specify a map configuration file, so the default configuration it used.



## Example 2

Loading configuration from a URL.


### Setup 2A
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-show-tool=baseMaps&smk-hide-tool=markup&smk-config={"name":"Test%20App","viewer":{"baseMap":"Streets"}})
- `smk-show-tool=baseMaps`
- `smk-hide-tool=markup`
- `smk-config={"name":"Test App","viewer":{"baseMap":"Streets"}}`


### Setup 2B
```html
<script src="smk.js"
    smk-config="show-tool=baseMaps|hide-tool=markup|{&quot;name&quot;:&quot;Test App&quot;,&quot;viewer&quot;:{&quot;baseMap&quot;:&quot;Streets&quot;}}"
></script>
```

[`https://example.com/demo?`](https://example.com/demo)


### Setup 2C
```html
<script src="smk.js"
    smk-config="map-config.json"
></script>
```

[`https://example.com/demo?`](https://example.com/demo)


### Setup 2D
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-config=map-config.json)
- `smk-config=map-config.json`

### Result 2

- The map fills browser window.
- The window/tab has title 'Test App'.
- These tools are available: directions, location, search, and baseMaps.
- Map is centered over BC, showing whole province.
- The base map is 'Streets'.

### Discussion 2



## Example 3

Loading a layer.

### Setup 3A
```html
<script src="smk.js"
    smk-config="map-config.json|wms-layer.json|show-tool=layers"
></script>
```
[`https://example.com/demo?`](https://example.com/demo)


### Setup 3B
```html
<script src="smk.js"
    smk-config="map-config.json|show-tool=layers"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-config=wms-layer.json)
- `smk-config=wms-layer.json`


### Setup 3C
```html
<script src="smk.js"
    smk-config="map-config.json"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?show-tool=layers&layer=https%3a%2f%2fopenmaps.gov.bc.ca%2fgeo%2fpub%2fwms,WHSE_TANTALIS.TA_CROWN_LEASES_SVW,Lease-Applications-Tantalis-Colour-Filled,Lease%20Applications%20-%20Tantalis%20-%20Colour%20Filled)
- `smk-config=wms-layer.json`
- `layer=https://openmaps.gov.bc.ca/geo/pub/wms,WHSE_TANTALIS.TA_CROWN_LEASES_SVW,Lease-Applications-Tantalis-Colour-Filled,Lease Applications - Tantalis - Colour Filled`


### Result 3

- The map fills browser window.
- The window/tab has title 'Test App'.
- These tools are available: directions, location, search, markup, and layers.
- Map is centered over BC, showing whole province.
- The base map is 'Streets'.
- The layer list shows one layer: 'Lease Applications - Tantalis - Colour Filled', and it is visible.
- The map shows little green spots for the 'Lease Applications - Tantalis - Colour Filled' layer.

### Discussion 3



## Example 4

Setting location of map.

### Setup 4A
```html
<script src="smk.js"
    smk-config="victoria.json"
></script>
```
[`https://example.com/demo?`](https://example.com/demo)


### Setup 4B
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-config=victoria.json)
- `smk-config=victoria.json`


### Setup 4C
```html
<script src="smk.js"
    smk-config="ll=-123.65114,48.53077|z=10"
></script>
```

[`https://example.com/demo?`](https://example.com/demo)



### Setup 4D
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-z=10&smk-ll=-123.65114,48.53077)
- `smk-z=10`
- `smk-ll=-123.65114,48.53077`


### Setup 4E
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-center=-123.65114,48.53077,10)
- `smk-center=-123.65114,48.53077,10`


### Setup 4F
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-extent=-124.0750,48.3087,-123.2273,48.7519)
- `smk-extent=-124.0750,48.3087,-123.2273,48.7519`


### Result 4

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: directions, location, search, and markup.
- Map is centered over southern Vancouver Island.
- The base map is 'Topographic'.



## Example 5

Changing URL parameter prefix.
The default URL parameter prefix is `smk-`, but this can be changed.
You may want the parameters processed by SMK to be prefixed with `foo-` for example.
The URL parameters can be processed before or after other configuration specified in the `smk-config` attribute.

### Setup 5A
```html
<script src="smk.js"
    smk-config="victoria.json|?foo-"
></script>
```
[`https://example.com/demo?`](https://example.com/demo?smk-config=kamloops.json)
- `smk-config=kamloops.json`


### Setup 5B
```html
<script src="smk.js"
    smk-config="?foo-|victoria.json"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?foo-config=kamloops.json)
- `foo-config=kamloops.json`


### Setup 5C
```html
<script src="smk.js"
    smk-config="kamloops.json|?foo-"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?foo-config=victoria.json)
- `foo-config=victoria.json`



### Setup 5D
```html
<script src="smk.js"
    smk-config="?"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?config=victoria.json)
- `config=victoria.json`


### Result 5

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: directions, location, search, and markup.
- Map is centered over southern Vancouver Island.
- The base map is 'Topographic'.

### Discussion 5

The order of configuration sources in `smk-config` attribute is important.
URL parameters that don't match the prefix are ignored.
The URL parameter prefix can be empty.




## Example 6

Enabling tools.

### Setup 6A
```html
<script src="smk.js"
    smk-config="show-tool=all"
></script>
```
[`https://example.com/demo?`](https://example.com/demo?)


### Setup 6B
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-show-tool=all)
- `smk-show-tool=all`


### Setup 6C
```html
<script src="smk.js"
    smk-config="?smk-|show-tool=about,baseMaps,coordinate,identify,layers"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-show-tool=measure,menu,minimap&smk-show-tool=pan,scale,select,zoom)
- `smk-show-tool=pan,scale,select,zoom`
- `smk-show-tool=measure,menu,minimap`

### Result 6

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: about, baseMaps, coordinate, directions, identify, layers, location, markup, measure, menu, minimap, pan, scale, search, select, and zoom.
- The base map is 'Topographic'.

### Discussion 6

The `all` tool stands for all tools.
The order of tools that tools are enabled doesn't control their position.



## Example 7

Configuring tools.

### Setup 7A
```html
<script src="smk.js"
    smk-config="show-tool=scale|{&quot;tools&quot;:[{&quot;type&quot;:&quot;scale&quot;,&quot;showFactor&quot;:false}]}"
></script>
```
[`https://example.com/demo?`](https://example.com/demo?)


### Setup 7B
```html
<script src="smk.js"
    smk-config="show-tool=scale|?smk-"
></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-show-tool=all)
- `smk-config={"tools":[{"type":"scale","showFactor":false}]}`


### Setup 7C
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-show-tool=scale&smk-config={"tools":[{"type":"scale","showFactor":false}]})
- `smk-show-tool=scale`
- `smk-config={"tools":[{"type":"scale","showFactor":false}]}`

### Result 7

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: directions, location, scale, search, and markup.
- The scale display doesn't show the scale factor.
- The base map is 'Topographic'.




## Example 8

Running an ad-hoc query.

### Setup 8A
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-config=wms-layer.json&smk-config=wms-layer-attributes.json&smk-query=whse-tantalis-ta-crown-leases-svw,and,TENURE_STATUS=%22ACCEPTED%22)
- `smk-config=wms-layer.json`
- `smk-config=wms-layer-attributes.json`
- `smk-query=whse-tantalis-ta-crown-leases-svw,and,TENURE_STATUS="ACCEPTED"`


### Setup 8B
```html
<script src="smk.js"></script>
```

[`https://example.com/demo?`](https://example.com/demo?smk-config=wms-layer.json&smk-config=wms-layer-attributes.json&smk-config=wms-layer-query.json)
- `smk-config=wms-layer.json`
- `smk-config=wms-layer-attributes.json`
- `smk-config=wms-layer-query.json`


### Result 8

- The map fills browser window.
- The window/tab has title 'SMK Default Map'.
- These tools are available: directions, location, scale, search, query, and markup.
- The base map is 'Topographic'.
- The query tool is activated when the map loads.
- The query is executed immediately.

### Discussion 8

The ad-hoc URL parameter query definitions only allow a subset of possible query structures.
The ad-hoc URL parameter query also controls the tool active at startup, and uses a special configuration to execute query immediately.
For this query, the conjunction could be 'and' or 'or', as there is only one predicate.