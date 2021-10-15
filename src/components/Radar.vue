<template>
  <div>
    <div id="RadarImagesWrapper">
      <h2>CAPPI</h2>
      <img
        id="RadarImageWrapper"
        :src="linkCAPPI"
      >
      <h2>CMAX</h2>
      <img
        id="RadarImageWrapper"
        :src="linkCMAX"
      >
      <h2>PAC(1hr accumulated rainfall)</h2>
      <img
        id="RadarImageWrapper"
        :src="linkPAC"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radar',
  data() {
    return {
      linkCAPPI: '',
      linkCMAX: '',
      linkPAC: '',
    };
  },
  mounted() {
    this.onPageLoad();
  },
  methods: {
    onPageLoad() {
      const pre = 'https://danepubliczne.imgw.pl/datastore/getfiledown/Oper/Polrad/Produkty/POLCOMP/';
      const currDate = new Date();
      const tenMinutesAsVariable = 600000;
      const finalDate = new Date(currDate - tenMinutesAsVariable);

      let day = finalDate.getUTCDate();
      if (day.toString().length < 2) day = `0${day}`;
      let month = finalDate.getUTCMonth() + 1;
      if (month.toString().length < 2) month = `0${month}`;

      const year = finalDate.getUTCFullYear();

      let hour = finalDate.getUTCHours();
      if (hour.toString().length < 2) hour = `0${hour}`;
      let minutes = finalDate.getUTCMinutes();
      if (minutes.toString().length < 2) minutes = `0${minutes}`;
      minutes = minutes.toString().slice(0, 1);
      minutes = `${minutes}0`;

      const cappiImgId = `COMPO_CAPPI.comp.cappi/${year}${month}${day}${hour}${minutes}0000dBZ.cappi.png`;
      const cmaxImgId = `COMPO_CMAX_250.comp.cmax/${year}${month}${day}${hour}${minutes}0000dBZ.cmax.png`;
      const pacImgId = `COMPO_PAC.comp.pac/${year}${month}${day}${hour}${minutes}0000dBA.pac.png`;

      this.linkCAPPI = pre + cappiImgId;
      this.linkCMAX = pre + cmaxImgId;
      this.linkPAC = pre + pacImgId;
    },
  },
};
</script>

<style scoped>
#RadarImageWrapper {
  border: 3px solid black;
  width: 100%;
  height: 100%;
}
#RadarImagesWrapper {
  display: grid;
  justify-content: center;
}
</style>
