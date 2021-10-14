<template>
  <div id="mapContainer" />
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'SynopMap',
  data() {
    return {
      mapObject: null, // init leaflet map variable as null(no need for using prototype), used in this component
    };
  },
  mounted() {
    this.mountLeafletMap();
  },
  beforeDestroy() {
    this.removeLeafletMapFromMemory();
  },
  methods: {
    mountLeafletMap() {
      this.mapObject = L.map('mapContainer', {
        minZoom: 5,
        maxZoom: 14,
      }); // initialize map, set bounds for min and max zoom(5,14)
      this.mapObject.setView([52.2324042317635, 21.008814032139522], 6); // set initial view to center of Warsaw, with default zoom as 6

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.mapObject); // add map display to map object(without this the map is empty)
      const debugArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // initialize simple debug array
      this.DebugAddStations(debugArr); // add debug random stations
    },
    removeLeafletMapFromMemory() {
      if (this.mapObject) {
        this.mapObject.remove(); // if map was initialized, remove it when leaving this page(idk if this is necessary)
      }
    },
    DebugAddStations(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((e) => this.DebugStationFactory(e)); // for every entry in array call DebugStationFactory to add marker to map
      }
    },
    DebugStationFactory(value) {
      let lat = Math.random(); // random 0-1 latitude
      lat = this.remap(lat, 0, 1, 48.5, 55.0); // remap latitude from 0-1 to 48.5-55.5
      let lon = Math.random(); // random 0-1 longtitude
      lon = this.remap(lon, 0, 1, 14.0, 24.5);// remap longtitude from 0-1 to 14.0-24.5

      const marker = new L.Marker([lat, lon], { opacity: 0.0 }); // leaflet marker variable, opacity may be set to zero
      marker.bindTooltip(`${value} °C`, { // add celcius value to marker's tooltip
        permanent: true, // always display
        direction: 'center', // center tooltip
      });
      marker.addTo(this.mapObject); // add marker object to map
    },
    remap(value, inmin, inmax, outmin, outmax) {
      return ((value - inmin) * (outmax - outmin)) / (inmax - inmin) + outmin;
      // remap values from one range to other, very usefull. TODO: make this function global for future possible use!
    },
  },
};
</script>

<style scoped>
#mapContainer {
  margin: auto;
  width: 80vw;
  height: 80vh;
  border: 5px solid black;
  border-radius: 10px;
}
</style>
