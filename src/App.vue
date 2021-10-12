<template>
  <Index msg="Welcome to Your Vue.js App"/>
</template>

<script>
import Index from './view/index'
import hellow from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    Index,
    hellow:hellow
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
