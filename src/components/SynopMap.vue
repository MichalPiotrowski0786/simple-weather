<template>
  <div v-if="!isLoaded" class="loadercontent">
    <img src="https://ems.medico.com.bd/css/spinner.gif" class="loader">
  </div>
  <div id="selectorContainer">
    <select id="selector" v-model="selectedOption">
      <option v-for="option in selectorOptions" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
  <div id="mapContainer" />
</template>

<script>
import 'leaflet/dist/leaflet.css';
import '../assets/colormap.css';
import L from 'leaflet';

const datafile = require('../assets/ids.json'); // file that contains ids and locations for desired stations

export default {
  name: 'SynopMap',
  data() {
    return {
      mapObject: null,
      stations: [],
      selectorOptions: [
        { text: 'Temperature', value: 0 },
        { text: 'Gusts', value: 1 },
      ],
      markers: [],
      selectedOption: 0,
      isLoaded: false,
    };
  },
  watch: {
    selectedOption() {
      if (this.mapObject != null) {
        this.isLoaded = false;
        this.getMeasurements(this.selectedOption);
      }
    },
  },
  mounted() {
    this.mountLeafletMap();
    this.getMeasurements(this.selectedOption);
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
    },
    removeLeafletMapFromMemory() {
      if (this.mapObject) {
        this.mapObject.remove(); // if map was initialized, remove it when leaving this page(idk if this is necessary)
      }
    },
    removeLeafletMarkers() {
      if (this.markers.length > 0 && this.mapObject !== null) {
        this.markers.forEach((marker) => {
          this.mapObject.removeLayer(marker);
        });
      }
    },
    async getMeasurements(type) {
      if (datafile != null && datafile.length > 0) {
        let stationsdata = [];
        this.removeLeafletMarkers();

        await this.returnMultiplePromises(datafile).then((res) => { stationsdata = res; });
        this.isLoaded = true; // when content is loaded disable spinner
        // add markers, tooltips and style them
        let loopIndex = 0;
        stationsdata.forEach((station) => {
          const marker = L.marker([station.lat, station.lon], { opacity: 0.0 }).addTo(this.mapObject);
          this.markers.push(marker);
          const styles = document.getElementById(`tooltip-style${loopIndex}`);
          if (styles !== null) styles.parentNode.removeChild(styles);

          let rawValue = 0;
          let remappedRawValue = 0;
          if (type === 1) {
            rawValue = station.windMaxVelocityRecords.slice(-1)[0].value;
            remappedRawValue = this.remap(rawValue, 0, 40, 180, 280);

            rawValue *= 3.6;
            rawValue = `${rawValue.toFixed(1)} km/h`;
          } else { // default type - temperature
            rawValue = station.temperatureAutoRecords.slice(-1)[0].value;
            remappedRawValue = 300 - this.remap(rawValue, -30, 40, 0, 300);
            rawValue = `${rawValue} °C`;
          }

          const style = document.createElement('style'); // this part is stupid or genius
          style.id = `tooltip-style${loopIndex}`; // id for reference to remove this when changing data type
          style.lang = 'text/css';
          // dynamically generate css class to make custom color for tooltip
          style.innerHTML = `.tooltipStylingClass${loopIndex} { background-color: hsl(${Math.trunc(remappedRawValue)}, 100%, 65%); }`;
          document.getElementsByTagName('head')[0].appendChild(style);

          const tooltip = L.tooltip({
            direction: 'center', permanent: true, opacity: 1.0, className: `overall tooltipStylingClass${loopIndex}`,
          });
          tooltip.setContent(rawValue);
          marker.bindTooltip(tooltip);

          loopIndex += 1;
        });
      }
    },
    async returnMultiplePromises(objects) {
      const requests = [];
      const responses = [];

      objects.forEach((object) => {
        requests.push(fetch(`https://hydro.imgw.pl/api/station/meteo/?id=${object.id}`, {
          method: 'GET',
        })
        // Add response to array
          .then((response) => response.json())
          .then((data) => {
            if (data.temperatureAutoRecords.length > 0
            && data.windVelocityTelRecords.length > 0
            && data.windMaxVelocityRecords.length > 0) {
              const redata = data; // reassign data and add lat, lon. then push to output array
              redata.lat = object.lat;
              redata.lon = object.lon;

              responses.push(data);
            }
          })
          .catch((err) => console.log(err)));
      });

      await Promise.all(requests); // Await all requests
      return responses; // return all responses
    },
    remap(value, inmin, inmax, outmin, outmax) {
      return ((value - inmin) * (outmax - outmin)) / (inmax - inmin) + outmin;
      // remap values from one range to other, very usefull. TODO: make this function global for future possible use!
    },
  },
};
</script>

<style lang="scss" scoped>
#mapContainer {
  margin: auto;
  width: 80vw;
  height: 70vh;
  border: 5px solid black;
  border-radius: 10px;
}
#selector {
  font-size: 30px;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid black;
  margin-top: 20px;
  &Container {
    padding: 1vw;
  }
}
.loader {
  width: 200px;
  height: 200px;
}
.loadercontent {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
