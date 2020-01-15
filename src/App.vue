<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Ver registros de trabajo</router-link> |
      <router-link to="/mantenimiento">Enviar trabajo</router-link> |
      <router-link to="/hospedaje">.</router-link>

    </div>
    <router-view/>
  </div>
</template>

<style lang="css">
@import '../node_modules/vue2vis/dist/vue2vis.css';

</style>
<style lang="scss">


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden !important;
  background-image: linear-gradient(-125deg, #e8f0f9, #295173, #192835);
  background-image: linear-gradient(50deg, #502d55, #502d55, #8e4b71, #e7c8b7);
  background-image: linear-gradient(50deg, #7b77c1, #908ac7d9, #dcccf173, #f5e9f38a);
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
