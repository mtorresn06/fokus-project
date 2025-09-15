<template>
  <div class="fondo">
    <ContenedorInicioGUI>
      <LogoGUI />

      <div class="botones">
        <BotonGUI tipo="primario" @click="irALogin">Iniciar Sesión</BotonGUI>
        <BotonGUI tipo="secundario" @click="irARegistro">Registrarse</BotonGUI>
      </div>
    </ContenedorInicioGUI>
  </div>
</template>

<script>
import BotonGUI from "../../components/BotonGUI.vue";
import LogoGUI from "./LogoGUI.vue";
import ContenedorInicioGUI from "./ContenedorInicioGUI.vue";

export default {
  name: "InicioGUI",
  components: { BotonGUI, LogoGUI, ContenedorInicioGUI },
  methods: {
    irALogin() {
      this.$router.push("/login");
    },
    irARegistro() {
      this.$router.push("/registro");
    }
  }
};
</script>

<style scoped>
.fondo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f4f6f9;
}

.botones {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  align-items: center;
}
</style>