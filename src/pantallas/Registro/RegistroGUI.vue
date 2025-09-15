<template>
  <div class="contenedor-registro">
    <!-- Botón volver -->
    <button class="volver" @click="irAInicio">⬅ Volver</button>

    <div class="tarjeta-registro">
      <!-- Logo -->
      <RegistroLogo />

      <!-- Formulario -->
      <RegistroFormulario
        v-model:usuario="usuario"
        v-model:contrasena="contrasena"
        v-model:confirmar="confirmar"
        v-model:mostrarPassword="mostrarPassword"
        v-model:mostrarConfirmar="mostrarConfirmar"
        @registrar="registrarUsuario"
      />

      <!-- Enlace a login -->
      <p class="login">
        ¿Ya tienes una cuenta?
        <span @click="irALogin">Inicia sesión</span>
      </p>
    </div>
  </div>
</template>

<script>
import RegistroLogo from "./RegistroLogo.vue";
import RegistroFormulario from "./RegistroFormulario.vue";
import Swal from "sweetalert2";

export default {
  name: "RegistroGUI",
  components: { RegistroLogo, RegistroFormulario },
  data() {
    return {
      usuario: "",
      contrasena: "",
      confirmar: "",
      mostrarPassword: false,
      mostrarConfirmar: false,
    };
  },
  methods: {
    registrarUsuario() {
      if (this.contrasena !== this.confirmar) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "Las contraseñas no coinciden",
          confirmButtonColor: "#67b2b4",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: `Usuario "${this.usuario}" creado correctamente`,
        confirmButtonColor: "#67b2b4",
      }).then(() => {
        this.$router.push("/registrador");
      });
    },
    irAInicio() {
      this.$router.push("/");
    },
    irALogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.contenedor-registro {
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

.tarjeta-registro {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
}

.login span {
  color: #67b2b4;
  cursor: pointer;
  font-weight: bold;
}
</style>