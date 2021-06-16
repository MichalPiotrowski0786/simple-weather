<template>
  <div>
    <div id="home">
      <div id="sidebar">
        <router-link to="/radar">Radar</router-link>
      </div>
      <div id="main">
        <MainComponent/>
      </div>
    </div>
  </div>
</template>

<script>
import MainComponent from '@/components/MainComponent.vue';

export default {
  name: 'Home',
  components: {
    MainComponent,
  },
};
</script>

<style scoped>
#home {
  display: flex;
}
#sidebar {
  border-right: 1px solid black;
  padding: 5px;
  margin-top: 20px;
  font-size: 30px;
  flex: 20%;
}
#main {
  padding: 5px;
  flex: 80%;
}
a {
  color: rgb(51,51,51);
  text-decoration-line: none;
}
a:hover {
  color: black;
  text-decoration-line: underline;
}
</style>
