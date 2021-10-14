<template>
  <div id="mapContainer" />
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'Wxmap',
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
      const debugArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      this.DebugAddStations(debugArr); // add debug random stations
    },
    removeLeafletMapFromMemory() {
      if (this.mapObject) {
        this.mapObject.remove(); // if map was initialized, remove it when leaving this page(idk if this is necessary)
      }
    },
    DebugAddStations(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((e) => this.DebugStationFactory(e));
      }
    },
    DebugStationFactory(value) {
      let lat = Math.random();
      lat = this.remap(lat, 0, 1, 48.5, 55.0);
      let lon = Math.random();
      lon = this.remap(lon, 0, 1, 14.0, 24.5);

      const marker = new L.Marker([lat, lon], { opacity: 0.0 }); // opacity may be set to zero
      marker.bindTooltip(`${value} °C`, {
        permanent: true,
        direction: 'center',
      });
      marker.addTo(this.mapObject);
    },
    remap(value, inmin, inmax, outmin, outmax) {
      return ((value - inmin) * (outmax - outmin)) / (inmax - inmin) + outmin;
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
