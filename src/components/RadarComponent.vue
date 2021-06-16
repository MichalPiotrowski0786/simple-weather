<template>
  <div>
    <div>
      <img
      id="RadarImageWrapper"
      :src="link"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radar',
  data() {
    return {
      link: '',
    };
  },
  created: {
    onPageLoad() {
      const pre = 'https://danepubliczne.imgw.pl/datastore/getfiledown/Oper/Polrad/Produkty/POLCOMP/COMPO_CAPPI.comp.cappi/';
      const imgId = '2021061516200000dBZ.cappi.png';

      this.link = pre + imgId;
      console.log(this.link);
    },
  },
};
</script>

<style scoped>
#RadarImageWrapper {
  display: flex;
  margin: 20px;
  justify-content: center;
  border: 3px solid black;
}
</style>
