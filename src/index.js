var quadras = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/ExpressaSul/master/Quadras.geojson",
  dataType: "json",
  success: console.log("Quadras data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var lotes = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/ExpressaSul/master/Lotes.geojson",
  dataType: "json",
  success: console.log("Lotes data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var limites = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/ExpressaSul/master/LimitesAterro.geojson",
  dataType: "json",
  success: console.log("Limits data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var areasVerdes = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/ExpressaSul/master/AreasVerdes.geojson",
  dataType: "json",
  success: console.log("AreasVerdes data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

var institucional = $.ajax({
  url:"https://raw.githubusercontent.com/lfpdroubi/ExpressaSul/master/AreasInstitucionais.geojson",
  dataType: "json",
  success: console.log("Institutinal data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText);
  }
});

  /* when().done() SECTION*/
  // Add the variable for each of your AJAX requests to $.when()
  $.when(quadras, lotes, limites, areasVerdes, institucional).done(function() {

  var mappos = L.Permalink.getMapLocation(zoom = 14, center = [-27.62587,-48.53059]);

  var map = L.map('map', {
    center: mappos.center,
    zoom: mappos.zoom,
    attributionControl: false,
    zoomControl: false,
    preferCanvas: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topright'
    }
  });

  L.Permalink.setup(map);

  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // create the sidebar instance and add it to the map
  var sidebar = L.control.sidebar({
      autopan: false,       // whether to maintain the centered map point when opening the sidebar
      closeButton: true,    // whether t add a close button to the panes
      container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
      position: 'left',     // left or right
  }).addTo(map);
  //.open('home');


  // Basemaps
  
  var wmsLayer = L.tileLayer.wms(
    'http://sigsc.sc.gov.br/sigserver/SIGSC/wms', {
      maxNativeZoom: 19,
      maxZoom: 100,
      layers: 'OrtoRGB-Landsat-2012',
      label: "SIG/SC",
      iconURL: 'sig-sc.png'
  }).addTo(map);

  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	  maxZoom: 17,
	  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
  });

  var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
  });

  var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
  });
  
  // Adds SIRGAS2000 definition
  proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ');

  // Adds SIRGAS2000 GeoJSON

  var LIMITES = L.Proj.geoJson(limites.responseJSON, {
    style: {
      color: 'yellow',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Área (m2): </b>" + feature.properties.Area
      );
    }
  }).addTo(map);

/*
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);
*/
  var Quadras = L.Proj.geoJson(quadras.responseJSON, {
    style: {
      color: 'blue',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Quadra: </b>" + feature.properties.ID +"<br>" +
        "<b>Área (m2): </b>" + feature.properties.Area.toLocaleString('de-DE', { maximumFractionDigits: 2 }) 
      );
    }
  });
  
  var Lotes = L.Proj.geoJson(lotes.responseJSON, {
    style: {
      color: 'gray',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Lote: </b>" + feature.properties.ID +"<br>" +
        "<b>Área (m2): </b>" + feature.properties.area.toLocaleString('de-DE', { maximumFractionDigits: 2 })  + "<br>" +
        "<b>Perímetro (m): </b>" + feature.properties.perimeter.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Unitário (R$/m2): </b>" + feature.properties.fit.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Unitário Mínimo (R$/m2): </b>" + feature.properties.lwr.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Unitário Máximo (R$/m2): </b>" + feature.properties.upr.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Total (R$/m2): </b>" + feature.properties.Vmedio.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Total Mínimo (R$/m2): </b>" + feature.properties.Vmin.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" +
        "<b>Valor Total Máximo (R$/m2): </b>" + feature.properties.Vmax.toLocaleString('de-DE', { maximumFractionDigits: 2 }) + "<br>" 
      );
    }
  }).addTo(map);

  var AreasVerdes = L.geoJSON(areasVerdes.responseJSON, {
    style: {
      color: 'green',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Área (m2): </b>" + feature.properties.Area.toLocaleString('de-DE', { maximumFractionDigits: 2 })
      );
    }
  }).addTo(map);

  var Institucional = L.Proj.geoJson(institucional.responseJSON, {
    style: {
      color: 'orange',
      weight: 2
    },
    onEachFeature: function( feature, layer ){
      layer.bindPopup(
        "<b>Id: </b>" + feature.properties.ID +"<br>" +
        "<b>Área (m2): </b>" + feature.properties.Area.toLocaleString('de-DE', { maximumFractionDigits: 2 })
      );
    }
  }).addTo(map);


  var miniMap = new L.Control.MiniMap(Esri_NatGeoWorldMap, {
      position: 'topleft',
      toggleDisplay: true,
      zoomLevelOffset: -6
    }
  ).addTo(map);

  // Adds basemaps choices

  /*
  var basemaps = [
          Esri_WorldImagery, Esri_NatGeoWorldMap, OrtofotosSDS,
          OpenTopoMap, Stamen_Watercolor, Stamen_Terrain
          ];
  map.addControl(L.control.basemaps({
    basemaps: basemaps,
    tileX: 0,  // tile X coordinate
    tileY: 0,  // tile Y coordinate
    tileZ: 1   // tile zoom level
    })
  );
  */

  var baseLayers = {
    "Ortofotos (2012)": wmsLayer,
		"OpenTopoMap": OpenTopoMap,
		"Esri Satélite": Esri_WorldImagery,
		"Aquarela (Stamen)": Stamen_Watercolor,
		"Rótulos (Stamen)": Stamen_Terrain
	};

	L.control.mousePosition({
    position: 'bottomleft'
  }).addTo(map);

  var overlays = {
		"Limites": LIMITES,
		"Quadras": Quadras,
		"Lotes": Lotes,
		"institucional": Institucional,
		"Áreas Verdes": AreasVerdes
	};

	L.control.layers(baseLayers, overlays).addTo(map);

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(map);
	}

	map.on('click', onMapClick);

  /*
	map.locate({setView: true, maxZoom: 16});

	function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
  }

  function onLocationError(e) {
      alert(e.message);
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);
  */
});