<template>
  <div id="selectorContainer">
    <select
      id="selector"
      @change="GetSelectorIndex($event.target.selectedIndex)"
    >
      <option value="temp">
        Temperature
      </option>
      <option value="press">
        Pressure
      </option>
    </select>
  </div>
  <div id="mapContainer" />
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as jsonData from '../assets/data.json';

export default {
  name: 'SynopMap',
  data() {
    return {
      mapObject: null, // init leaflet map variable as null(no need for using prototype), used in this component
      selectorIndex: null,
    };
  },
  mounted() {
    this.mountLeafletMap();
    this.getDataFromSynop();
  },
  beforeDestroy() {
    this.removeLeafletMapFromMemory();
  },
  methods: {
    async getDataFromSynop() {
      const apiLink = 'https://danepubliczne.imgw.pl/api/data/synop/';
      await fetch(apiLink, {
        method: 'GET',
      })
        .then((res) => {
          res
            .json()
            .then((data) => {
              if (this.mapObject) this.AddStations(data);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    mountLeafletMap() {
      this.mapObject = L.map('mapContainer', {
        minZoom: 5,
        maxZoom: 14,
      }); // initialize map, set bounds for min and max zoom(5,14)
      this.mapObject.setView([52.2324042317635, 21.008814032139522], 6); // set initial view to center of Warsaw, with default zoom as 6

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.mapObject); // add map display to map object(without this the map is empty)
    },
    removeLeafletMapFromMemory() {
      if (this.mapObject) {
        this.mapObject.remove(); // if map was initialized, remove it when leaving this page(idk if this is necessary)
      }
    },
    GetSelectorIndex(index) {
      this.selectorIndex = index;
    },
    AddStations(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((e) => this.StationFactory(e)); // for every entry in array call DebugStationFactory to add marker to map
      }
    },
    StationFactory(station) {
      const currentCity = jsonData.filter((e) => (e.Name === station.stacja)); // get current station from json file to use lat and lon
      const lat = currentCity[0].Latitude; // latitude variable for current station
      const lon = currentCity[0].Longitude; // longitude variable for current station

      const marker = new L.Marker([lat, lon], { opacity: 0.0 }); // leaflet marker variable, opacity may be set to zero
      this.selectMarkerMode(0, marker, station);
    },
    selectMarkerMode(mode, marker, station) {
      let value = null;
      let tooltipClass = null;
      if (mode === 0) {
        [value, tooltipClass] = this.temperatureMode(station.temperatura);
      } else if (mode === 1) {
        [value, tooltipClass] = this.pressureMode(station.cisnienie);
      }
      marker.bindTooltip(value, { // add value to marker's tooltip
        permanent: true, // always display
        direction: 'center', // center tooltip
        className: tooltipClass,
        opacity: 1,
      }).addTo(this.mapObject);
    },
    temperatureMode(temperature) {
      const v = Math.round(Math.abs(temperature));
      let prefix = '';
      if (temperature < 0) prefix = 'Sub';
      else prefix = 'Over';
      const cssName = `tooltipClass ${prefix}${v}`;

      return [`${temperature} °C`, cssName];
    },
    pressureMode(pressure) {
      let v = Math.round(Math.abs(pressure));
      v = this.remap(v, 950, 1050, 0, 40);
      let prefix = '';
      if (pressure < 1023) prefix = 'Sub';
      else prefix = 'Over';
      const cssName = `tooltipClass ${prefix}${v}`;

      return [`${pressure} hpa`, cssName];
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
  height: 70vh;
  border: 5px solid black;
  border-radius: 10px;
}
#selectorContainer {
  padding: 1vw;
}
#selector {
  font-size: 30px;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid black;
  margin-top: 20px;
}
</style>
