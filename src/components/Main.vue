<template>
  <div>
    <input
      id="cityInputWrapper"
      v-model="cityToSearch"
      type="text"
      placeholder="Type location to see weather..."
    >
    <button
      id="cityButtonWrapper"
      @click="onCityButtonClicked"
    >
      Search
    </button>
    <div
      v-if="isResultVisible"
      id="resultWrapper"
    >
      <p>Location: {{ city }}, {{ country }}</p>
      <p>Temperature: {{ temperature }} °C</p>
      <p>Humidity: {{ humidity }}%</p>
      <p>Pressure: {{ pressure }} hpa</p>
      <p>Wind Speed: {{ wind_speed }}</p>
      <p>Wind Gust: {{ wind_gust }}</p>
      <p>Wind Direction: {{ wind_dir }}°</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainComponent',
  data() {
    return {
      cityToSearch: '',
      tempData: {},
      city: '',
      country: '',
      temperature: '',
      pressure: '',
      humidity: '',
      wind_speed: '',
      wind_gust: '',
      wind_dir: '',
      isResultVisible: false,
    };
  },
  methods: {
    async onCityButtonClicked() {
      this.isResultVisible = false;
      const apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityToSearch}&appid=${process.env.VUE_APP_API_KEY}&units=metric`;
      await fetch(apiLink, {
        method: 'GET',
      })
        .then((res) => {
          res
            .json()
            .then((data) => {
              console.log(data);
              this.city = data.name;
              this.country = data.sys.country;
              this.temperature = data.main.temp;
              this.pressure = data.main.pressure;
              this.humidity = data.main.humidity;
              this.wind_speed = `${data.wind.speed} m/s (${this.calculateWindInKPH(
                data.wind.speed,
              )} km/h)`;
              this.wind_gust = this.setWindGustResult(data.wind.gust);
              this.wind_dir = data.wind.deg;
              this.isResultVisible = true;
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    },
    setWindGustResult(result) {
      let symbol = '';
      if (result === undefined || result === null) {
        symbol = '-';
      } else {
        symbol = `${result} m/s (${this.calculateWindInKPH(result)} km/h)`;
      }
      return symbol;
    },
    calculateWindInKPH(result) {
      const output = result * 3.6;
      return output.toFixed(2);
    },
  },
};
</script>

<style scoped lang="scss">
#cityInputWrapper {
  font-size: 30px;
  width: 40%;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid black;
  margin-top: 20px;
}
#cityInputWrapper::placeholder {
  color: rgba(0, 0, 0, 0.25);
}
#cityButtonWrapper {
  font-size: 30px;
  background-color: rgb(200, 200, 200);
  border: 2px solid black;
  margin: 20px;
}
</style>
