// 'BespokeTool--101' is a concatenation of 'BespokeTool' and the instance name of the 
// configured tool (ie. '101'). 'Activated' indicates that the handler will run when the 
// tool is activated (versus the other options of initialized, deactivated and triggered). 
// The third argument in the SMK.Handler.set() function is the anonymous function that 
// executes when the BespokeTool--101 is activated.
SMK.HANDLER.set('BespokeTool--101', 'activated', (smk, tool) => {
    tool.component = Vue.component('Zoom', {
        data: function() {
            return {
                buttonText: "Fly to Victoria"
            }
        },
        methods: {
            handleZoom() {
                // The 'map' Leaflet Map object (https://leafletjs.com/reference.html#map-example)
                // is in a tree of objects initialized by SMK in the 'smk' global object. 
                // 'smk' gives access to all tools and data in the SMK app.
                const leafletMap = smk.$viewer.map;

                // We use Leaflet's API to store latitude and longitude coordinates.
                // 'L' is the global Leaflet object, and LatLng is an object that 
                // can store coordinates. (https://leafletjs.com/reference.html#latlng)
                const newCenter = new L.LatLng(48.45,-123.35);

                // We call the Leaflet Map's flyTo() method 
                // (https://leafletjs.com/reference.html#map-flyto). 
                leafletMap.flyTo(newCenter, 13);
            }
        },
        template: `
            <!-- All of a template's content must be inside a pair of parent tags. -->
            <div>
                <p>The Bespoke tool allows you to create your own custom tool for SMK apps. You can add HTML, CSS, and Javascript to provide unique functionality.</p>

                <p>This example includes a custom <a href="https://vuejs.org/">Vue.js</a> component that uses <a href="https://leafletjs.com/">Leaflet</a> API to update the map view. Click the button below to see this in action!</p>

                <div>
                    <button v-on:click="handleZoom">{{buttonText}}</button>
                </div>
            </div>
        `
    })
} )