SMK.HANDLER.set('BespokeTool--101', 'activated', (smk, tool) => {
    tool.component = Vue.component('Zoom', {
        data: function() {
            return {
                buttonText: "Fly to Victoria"
            }
        },
        methods: {
            handleZoom() {
                const leafletMap = smk.$viewer.map;
                const newCenter = new L.LatLng(48.45,-123.35);
                leafletMap.flyTo(newCenter, 13);
            }
        },
        template: `
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