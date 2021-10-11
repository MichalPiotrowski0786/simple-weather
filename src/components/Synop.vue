<template>
  <div>
    <select
      id="synopInputWrapper"
      v-model="selected"
    >
      <option
        v-for="item in arr"
        :key="item.id_stacji"
      >
        {{ item.stacja }}
      </option>
    </select>
    <div
      v-if="selected.length > 0"
      id="resultWrapper"
    >
      <p>Date: {{ selectedEntry.data_pomiaru }}</p>
      <p>Hour: {{ selectedEntry.godzina_pomiaru }} UTC</p>
      <p>Temperature: {{ selectedEntry.temperatura }} °C</p>
      <p>Wind speed: {{ selectedEntry.predkosc_wiatru }} m/s</p>
      <p>Wind direction: {{ selectedEntry.kierunek_wiatru }}</p>
      <p>Relative humidity: {{ selectedEntry.wilgotnosc_wzgledna }}%</p>
      <p>Accumulated rainfall: {{ selectedEntry.suma_opadu }} mm</p>
      <p>Pressure: {{ selectedEntry.cisnienie }} hpa</p>
    </div>
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
        if (item.stacja === this.selected) this.selectedEntry = item;
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
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
#synopInputWrapper {
  font-size: 30px;
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid black;
  margin-top: 20px;
}
</style>
