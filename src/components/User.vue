<template>
  <div id="userWrapper">
    <div v-if="isLogged == false">
      <button @click="onLoginButtonClicked">
        Log In
      </button>
      <button>
        Register
      </button>
    </div>
    <div v-if="isLogged == true">
      <button @click="onLogoutButtonClicked">
        Log out
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      isLogged: false,
    };
  },
  methods: {
    onLoginButtonClicked() {
      this.isLogged = true;
    },
    onLogoutButtonClicked() {
      this.isLogged = false;
    },
  },
};
</script>

<style scoped>
#userWrapper {
  display: flex;
  justify-content: right;
}
button{
  font-size: 20px;
  margin-right: 10px;
  background: none;
  border: none;
  border-bottom: 1px solid black;
}
button:hover{
  outline: 1px solid black;
}
</style>
