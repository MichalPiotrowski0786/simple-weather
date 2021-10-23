<template>
  <div id="nav">
    <h1>
      <b><a href="/">Weather.in</a></b>
    </h1>
  </div>
  <router-view />
</template>

<style lang="scss">
body {
  background-color: #ddd;
}
a {
  color: #555;
}
a:hover {
  color: #333;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}
#nav {
  text-align: left;
  padding-left: 20px;
  font-size: 30px;
  text-shadow: 1px 1px white;
}
#resultWrapper {
  padding-top: 20px;
  font-size: 30px;
  font-weight: bold;
  text-decoration-line: underline;
  text-decoration-color: rgba(0, 0, 0, 0.4);
}
</style>
