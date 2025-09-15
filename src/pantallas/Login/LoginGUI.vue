<template>
  <div class="contenedor-login">
    <button class="volver" @click="irAInicio">⬅ Volver</button>
    <TarjetaLoginGUI />
  </div>
</template>

<script>
import TarjetaLoginGUI from "./TarjetaLoginGUI.vue";

export default {
  name: "LoginGUI",
  components: { TarjetaLoginGUI },
  methods: {
    irAInicio() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.contenedor-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f6fbfb;
  padding: 1rem;
  position: relative;
}

.volver {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: #67b2b4;
  cursor: pointer;
}
</style>