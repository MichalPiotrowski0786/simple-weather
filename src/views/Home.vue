<template>
  <div>
    <section>
      <div id="user">
        <UserComponent />
      </div>
    </section>
    <section>
      <div id="home">
        <div id="sidebar">
          <router-link to="/radar">
            Radars
          </router-link><br><br>
          <router-link to="/synop">
            IMGW Synop
          </router-link><br><br>
          <router-link to="/wxmap">
            Wx Map
          </router-link>
        </div>
        <div id="main">
          <MainComponent />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MainComponent from '../components/Main.vue';
import UserComponent from '../components/User.vue';

export default {
  name: 'Home',
  components: {
    MainComponent,
    UserComponent,
  },
};
</script>

<style scoped>
#home {
  display: flex;
  padding-top: 5%;
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
#user {
  height: 5vh;
  border: none;
  border-bottom: 1px solid black;
}
a {
  color: rgb(51, 51, 51);
  text-decoration-line: none;
}
a:hover {
  color: black;
  text-decoration-line: underline;
}
</style>
