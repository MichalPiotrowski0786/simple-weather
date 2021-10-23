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

export default {
  name: 'SynopMap',
  data() {
    return {
      mapObject: null,
      stations: [],
      selectorOptions: [
        { text: 'Temperature', value: '0' },
        { text: 'Pressure', value: '1' },
        { text: 'Humidity', value: '2' },
        { text: 'Rainfall', value: '3' },
        { text: 'Wind', value: '4' },
      ],
      layer: [],
      selectedOption: '0',
    };
  },
  watch: {
    selectedOption() {
      if (this.mapObject != null) this.updateTooltipContent(this.selectedOption);
    },
  },
  mounted() {
    this.getStations();
    this.mountLeafletMap();
  },
  beforeDestroy() {
    this.removeLeafletMapFromMemory();
  },
  methods: {
    async getStations() {
      const apiLink = 'https://hydro.imgw.pl/api/map/?category=meteo';
      await fetch(apiLink, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((value) => {
          this.getMeasurements(value);
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
    async getMeasurements(data) {
      if (data != null && data.length > 0) {
        const ids = [];
        let stationsdata = [];
        data.forEach((location) => {
          const json = { id: location.i, lat: location.la, lon: location.lo };
          ids.push(json);
        });

        await this.returnMultiplePromises(ids).then((res) => { stationsdata = res; });

        stationsdata.forEach((station) => {
          const marker = L.marker([station.lat, station.lon], { opacity: 0.0 }).addTo(this.mapObject);
          const tooltip = L.tooltip({ direction: 'center', permanent: true, opacity: 1.0 });
          tooltip.setContent(`${station.temperatureAutoRecords.slice(-1)[0].value}`);
          marker.bindTooltip(tooltip);
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
              const redata = data;// reassign data and add lat, lon. then push to output array
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
    // updateTooltipContent(index) {
    //   const inputIndex = Number(index);
    //   let loopIndex = 0; // variable used to make unique values for each marker(tooltip)
    //   this.markers.forEach((marker) => {
    //     // clean previous styling elements
    //     // referencing style by id, then simply removing it after data was changed, simple and works
    //     // StackOverflow answer for this idea: https://stackoverflow.com/a/3797236

    //     const styles = document.getElementById(`tooltip-style${loopIndex}`);
    //     if (styles !== null) styles.parentNode.removeChild(styles); // remove these styles

    //     // remove tooltip to prevent stacking multiple tooltips in one place
    //     marker.unbindTooltip();

    //     const dataValue = this.stations[loopIndex];
    //     let dataValueString = '';
    //     let tempValue;

    //     // remap every value to hue representation, using common sense for this(example: pressure of 100 hpa is impossible)
    //     // refactor this later
    //     if (inputIndex === 0) {
    //       // temperature
    //       tempValue = dataValue.temperatura;
    //       dataValueString = ((tempValue === null) ? '-' : `${tempValue} °C`);

    //       tempValue = 300 - this.remap(tempValue, -20, 40, 0, 300);
    //     } else if (inputIndex === 1) {
    //       // pressure
    //       tempValue = dataValue.cisnienie;
    //       dataValueString = ((tempValue === null) ? '-' : `${tempValue} hpa`);

    //       tempValue = 300 - this.remap(tempValue, 970, 1030, 0, 300);
    //     } else if (inputIndex === 2) {
    //       // humidity
    //       tempValue = dataValue.wilgotnosc_wzgledna;
    //       dataValueString = ((tempValue === null) ? '-' : `${tempValue}%`);

    //       tempValue = this.remap(tempValue, 0, 100, 50, 240);
    //     } else if (inputIndex === 3) {
    //       // rainfall
    //       tempValue = dataValue.suma_opadu;
    //       dataValueString = ((tempValue === null) ? '-' : `${tempValue} mm`);

    //       tempValue = this.remap(tempValue, 0.0, 100.0, 0.0, 1.0); // use exponential for better scale (non-linear)
    //       tempValue = Math.sqrt(tempValue);
    //       tempValue = this.remap(tempValue, 0, 1, 60, 240);
    //     } else if (inputIndex === 4) {
    //       // wind speed
    //       tempValue = dataValue.predkosc_wiatru;
    //       dataValueString = ((tempValue === null) ? '-' : `${tempValue} m/s`);

    //       tempValue = this.remap(tempValue, 0.0, 50.0, 0.0, 1.0); // use exponential for better scale (non-linear)
    //       tempValue = Math.sqrt(tempValue);
    //       tempValue = this.remap(tempValue, 0, 1, 150, 330);
    //     } else {
    //       dataValueString = `${dataValue.id_stacji}`;
    //       tempValue = 330;
    //     }

    //     if (dataValueString !== '-') {
    //       const style = document.createElement('style'); // this part is stupid or genius
    //       style.id = `tooltip-style${loopIndex}`; // id for reference to remove this when changing data type
    //       style.lang = 'text/css';
    //       // dynamically generate css class to make custom color for tooltip
    //       style.innerHTML = `.tooltipStylingClass${loopIndex} { background-color: hsl(${Math.trunc(tempValue)}, 100%, 65%); }`;
    //       document.getElementsByTagName('head')[0].appendChild(style);

    //       const tooltip = L.tooltip({
    //         direction: 'center', permanent: true, opacity: 1.0, className: `overall tooltipStylingClass${loopIndex}`,
    //       });
    //       // const stationTime = (dataValue.godzina_pomiaru === null) ? ' - ' : dataValue.godzina_pomiaru;
    //       tooltip.setContent(`${dataValueString}`);
    //       marker.bindTooltip(tooltip);
    //     }
    //     loopIndex += 1;
    //   });
    // },
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
</style>
