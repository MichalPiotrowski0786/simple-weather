<template>
  <div class="synop-content">
    <select v-model="selected" class="synop-selector">
      <option v-for="item in arr" :key="item.id_stacji">
        {{ item.stacja }}
      </option>
    </select>
  </div>
  <div v-if="!!selected" class="synop-data">
    <p>Date: {{ selectedEntry.data_pomiaru }}</p>
    <p>Hour: {{ selectedEntry.godzina_pomiaru }} UTC</p>
    <p>Temperature: {{ selectedEntry.temperatura }} °C</p>
    <p>Relative humidity: {{ selectedEntry.wilgotnosc_wzgledna }}%</p>
    <p>Pressure: {{ selectedEntry.cisnienie }} hpa</p>
    <p>Wind speed: {{ selectedEntry.predkosc_wiatru }} km/h</p>
    <p>Wind direction: {{ selectedEntry.kierunek_wiatru }}°</p>
    <p>Accumulated rainfall: {{ selectedEntry.suma_opadu }} mm</p>
  </div>
</template>

<script>
export default {
  name: 'Synop',
  data() {
    return {
      arr: [],
      selected: '',
      selectedEntry: {},
    };
  },
  watch: {
    selected() {
      this.arr.forEach((item) => {
        if (item.stacja === this.selected) {
          this.selectedEntry = item;
          this.selectedEntry.predkosc_wiatru = this.calculateWindInKPH(this.selectedEntry.predkosc_wiatru);
        }
      });
    },
  },
  mounted() {
    this.getDataFromSynop();
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
              this.arr = data;
              console.log(this.arr);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    calculateWindInKPH(result) {
      const output = result * 3.6;
      return output.toFixed(2);
    },
  },
};
</script>

<style scoped>
.synop-content {
  display: flex;
  justify-content: center;
}
.synop-selector {
  width: 50%;
  height: 40px;
  margin: 80px 0px 40px 0px;
  font-size: 25px;
  text-align: center;
  border: none;
  border-bottom: 2px solid black;
  background: none;
  outline: none;
}
.synop-data {
  margin: 40px 0px 40px 0px;
  font-size: 25px;
}
</style>
