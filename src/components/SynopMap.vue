<template>
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
import * as jsonData from '../assets/data.json';

export default {
  name: 'SynopMap',
  data() {
    return {
      mapObject: null,
      selectorOptions: [
        { text: 'Temperature', value: '0' },
        { text: 'Pressure', value: '1' },
        { text: 'Humidity', value: '2' },
        { text: 'Rainfall', value: '3' },
        { text: 'Wind', value: '4' },
      ],
      markers: [],
      layer: [],
      coords: [],
      stations: [],
      selectedOption: '0',
    };
  },
  watch: {
    selectedOption() {
      if (this.mapObject != null) this.updateTooltipContent(this.selectedOption);
    },
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
              if (this.mapObject != null) this.StationFactory(data);
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
    StationFactory(data) {
      if (data != null && data.length > 0) {
        data.forEach((imgwStationRes) => {
          const coordinates = jsonData.filter((city) => (city.Name === imgwStationRes.stacja))[0]; // get current station from json file to use lat and lon

          this.coords.push(coordinates);
          this.stations.push(imgwStationRes);
        });

        this.markers = this.onCreateMarkers();
        this.updateTooltipContent('0');
      }
    },
    onCreateMarkers() {
      if (this.coords == null || this.coords.length === 0) return null;

      const temp = [];
      this.coords.forEach((item) => {
        const marker = L.marker([item.Latitude, item.Longitude], { opacity: 0.0 }).addTo(this.mapObject);
        temp.push(marker);
      });

      return temp;
    },
    updateTooltipContent(index) {
      const inputIndex = Number(index);
      let loopIndex = 0;
      this.markers.forEach((marker) => {
        // clean previous styling elements
        // referenced by style id, then simply removing it after data was changed, simple and works
        // StackOverflow answer for this idea: https://stackoverflow.com/a/3797236

        const styles = document.getElementById(`tooltip-style${loopIndex}`);
        if (styles !== null) styles.parentNode.removeChild(styles); // remove these styles

        // remove tooltip to prevent stacking of multiple tooltips
        marker.unbindTooltip();

        let dataValue = this.stations[loopIndex];
        let dataValueString = '';

        // remap every value to hue representation, using common sense for this(example: pressure of 100 hpa is impossible)
        // refactor this later, this is horrible
        if (inputIndex === 0) {
          // temperature
          const tempValue = dataValue.temperatura;
          dataValueString = ((tempValue === null) ? '-' : `${tempValue} °C`);

          dataValue = 300 - this.remap(tempValue, -20, 40, 0, 300);
        } else if (inputIndex === 1) {
          // pressure
          const tempValue = dataValue.cisnienie;
          dataValueString = ((tempValue === null) ? '-' : `${tempValue} hpa`);

          dataValue = 300 - this.remap(tempValue, 950, 1050, 0, 300);
        } else if (inputIndex === 2) {
          // humidity
          const tempValue = dataValue.wilgotnosc_wzgledna;
          dataValueString = ((tempValue === null) ? '-' : `${tempValue}%`);

          dataValue = this.remap(tempValue, 0, 100, 50, 240);
        } else if (inputIndex === 3) {
          // rainfall
          const tempValue = dataValue.suma_opadu;
          dataValueString = ((tempValue === null) ? '-' : `${tempValue} mm`);

          dataValue = this.remap(tempValue, 0, 100, 170, 300);
        } else if (inputIndex === 4) {
          // wind speed
          const tempValue = dataValue.predkosc_wiatru;
          dataValueString = ((tempValue === null) ? '-' : `${tempValue} m/s`);

          dataValue = this.remap(dataValue.predkosc_wiatru, 0, 50, 170, 300);
        } else {
          dataValueString = `${dataValue.id_stacji}`;
          dataValue = 330;
        }

        if (dataValueString !== '-') {
          const style = document.createElement('style'); // this part is stupid or genius
          style.id = `tooltip-style${loopIndex}`; // id for reference to remove this when changing data
          style.lang = 'text/css';
          // dynamically generate css class to make custom color for tooltip
          style.innerHTML = `.tooltipStylingClass${loopIndex} { background-color: hsl(${dataValue}, 100%, 50%); }`;
          document.getElementsByTagName('head')[0].appendChild(style);

          const tooltip = L.tooltip({ direction: 'center', permanent: true, className: `overall tooltipStylingClass${loopIndex}` });
          tooltip.setContent(dataValueString);
          marker.bindTooltip(tooltip);
        }
        loopIndex += 1;
      });
    },
    remap(value, inmin, inmax, outmin, outmax) {
      return Math.trunc(((value - inmin) * (outmax - outmin)) / (inmax - inmin) + outmin);
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
