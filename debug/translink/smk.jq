{
    layers: [ 
        .operationalLayers[] 
        | 
        (   
            if .layerType == "ArcGISFeatureLayer" 
            then { 
                type: "esri-feature",
                id: ( .title | ascii_downcase | gsub("[^a-z0-9]+"; "-"; "g") ),
                title,
                isVisible:      .visibility,
                serviceUrl:     .url,
                scaleMin:       .layerDefinition.minScale,
                scaleMax:       .layerDefinition.maxScale,
                where:          .layerDefinition.definitionExpression,
                drawingInfo:    .layerDefinition.drawingInfo
            }
            else empty end
        ) 
    ]
}