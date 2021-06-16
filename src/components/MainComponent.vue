<template>
  <div>
    <input
      v-model="cityForModel"
      id="cityInputWrapper"
      type="text"
      placeholder="Type location to see weather..."
    />
    <button @click="onCityButtonClicked" id="cityButtonWrapper">Search</button>
    <div v-if="isResultVisible" id="resultWrapper">
      <p>City: {{ city }}</p>
      <p>Country: {{ country }}</p>
      <p>Temperature: {{ temperature }} °C</p>
      <p>Pressure: {{ pressure }} hpa</p>
      <p>Humidity: {{ humidity }}%</p>
      <p>Wind Speed: {{ wind_speed }}</p>
      <p>Wind Gust: {{ wind_gust }}</p>
    </div>
  </div>
</template>

<script>
const apiKey = '75631f06853d699bf264f477854dd2a9';
export default {
  name: 'MainComponent',
  data() {
    return {
      cityForModel: '',
      tempData: {},
      city: '',
      country: '',
      temperature: '',
      pressure: '',
      humidity: '',
      wind_speed: '',
      wind_gust: '',
      isResultVisible: false,
    };
  },
  methods: {
    async onCityButtonClicked() {
      this.isResultVisible = false;
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.cityForModel}&appid=${apiKey}&units=metric`,
        {
          method: 'GET',
        },
      )
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
              this.wind_speed = `${data.wind.speed} m/s (${this.calculateWindInKPH(data.wind.speed)} km/h)`;
              this.wind_gust = this.setWindGustResult(data.wind.gust);
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
#resultWrapper {
  padding-top: 20px;
  font-size: 30px;
  font-weight: bold;
  text-decoration-line: underline;
  text-decoration-color: rgba(0, 0, 0, 0.4);
}
</style>
