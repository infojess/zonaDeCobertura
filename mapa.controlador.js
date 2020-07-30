// Jesús Arce 29/07/2020
// set "Zona de cobertura" with Leaflet, Geoman and geoJSON

var geoJSON_test = { //only for testing
    "type": "Feature",
    "properties": {
        "shape": "Polygon",
        "name": "Unnamed Layer",
        "category": "default"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-68.852953, -32.886795],
                [-68.85218, -32.89775],
                [-68.841878, -32.891408],
                [-68.852953, -32.886795]
            ]
        ]
    },
    "id": "176e9690-41c5-492c-be31-bc8e18e03523"
};

// Globals
var geoJSONpoligono = {
    "type": "Feature",
    "properties": {"Provincia": "Mendoza"},
    "geometry": {
        "type": "Polygon",
        "coordinates": []
    }
}
var geoJSON,poligono,mymap,layerPolygon = null;
var layerGroup = null;

window.onload = function () {
    let btnGuardar = document.getElementById("guardar");

    // init map
    mymap = L.map('map',{center: [-32.8902358, -68.8442004], zoom: 14});

    // init group of layers
    layerGroup = new L.layerGroup();
    layerGroup.addTo(mymap);

    // ------------------ Start Leaflet providers alternatives ------------------------
        // 1) OpenStreetMap
        /* L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
            {attribution: '&copy; <a href="http://' + 
            'www.openstreetmap.org/copyright">OpenStreetMap</a>'}
        ).addTo(mymap); */

        // 2) ArcGIS
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        }).addTo(mymap);

        // 3) HikeBike
        /* L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap); */
    // ------------------ End Leaflet providers alternatives --------------------------

    // leaflet-geoman toolbox options
    mymap.pm.addControls({
        position: 'topleft',
        drawCircle: false,
        drawMarker: false,
        drawRectangle: false,
        cutPolygon: false,
        drawPolyline: false,
        drawCircleMarker: false,
        dragMode: false,
        editMode: false
    });

    // Get prevoious data
    showPreviousGeojson();

    // when the polygon is created
    mymap.on('pm:create', e => {
        //console.log(e);
        if (poligono == null) {
            poligono = e;
            //console.log(poligono.layer._latlngs[0]);
            let lat, lng;
            geoJSONpoligono.geometry.coordinates.push([]);
            poligono.layer._latlngs[0].forEach((element) => {
                lat = element.lat;
                lng = element.lng;
                geoJSONpoligono.geometry.coordinates[0].push([lng, lat]);
            });

            mymap.pm.addControls({
                drawPolygon: false,
            });
            btnGuardar.disabled = false;
        }
    });

    // when the polygon is removed
    mymap.on('pm:remove', e => {
        poligono = null;
        mymap.pm.addControls({
            drawPolygon: true,
        });
        btnGuardar.disabled = true;
    });
};

// Only for testing
/* function dibujar() {
    try {
        // remove old GeoJSON layers
        layerGroup.clearLayers();

        // create a new layer
        let layerPoligono = new L.geoJSON(geoJSONpoligono);

        // add layer to group layers
        layerGroup.addLayer(layerPoligono);

    } catch (error) {
        console.log(error);
    }
} */

function showPreviousGeojson() {
    let btnGuardar = document.getElementById("guardar");

    // modify from here -----
    let data = JSON.stringify(geoJSON_test); // simulate api request (ajax GET)
    // ---------------------- to here.

    if (data.length > 0) { 
        try{
            layerGroup.clearLayers(); // remove old GeoJSON layers
            data = JSON.parse(data); // string to json
            let layerPoligono = new L.geoJSON(data); // create a new layer
            layerGroup.addLayer(layerPoligono); // add layer to group layers
            poligono = layerPoligono;

            // set toolbox options
            mymap.pm.addControls({
                drawPolygon: false,
            });

            btnGuardar.disabled = true;
        } catch (error) {
            //console.log(error);
        }
    }else{
        btnGuardar.disabled = true;
    }
}

function guardar(){
    let btnGuardar = document.getElementById("guardar");
    let status = document.getElementById("status");
    let data = JSON.stringify(geoJSONpoligono);

    try {
         // modify from here-----
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> simulate api request (ajax POST)
        // ---------------------- to here.

        btnGuardar.disabled = true;
        status.innerHTML = "Ok, zona de cobertura guardada correctamente.";    
    
    } catch (error) {
        console.log(error);    
        btnGuardar.disabled = true;
        status.innerHTML = "ERROR: no se pudo guardar la zona de cobertura.";
        status.style.color='red';
    }
}