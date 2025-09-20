<template>
  <div class="contenedor-registro">
    <!-- Botón volver -->
    <button class="volver" @click="irAInicio">⬅ Volver</button>

    <div class="tarjeta-registro">
      <!-- Logo -->
      <RegistroLogo />

      <!-- Formulario -->
      <RegistroFormulario
        v-model:correo="correo"
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
import { registrarUsuario } from "../../backend/autenticacion";
import Swal from "sweetalert2";

export default {
  name: "RegistroGUI",
  components: { RegistroLogo, RegistroFormulario },
  data() {
    return {
      correo: "",
      contrasena: "",
      confirmar: "",
      mostrarPassword: false,
      mostrarConfirmar: false,
    };
  },
  methods: {
    async registrarUsuario() {
      if (this.contrasena !== this.confirmar) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "Las contraseñas no coinciden",
          confirmButtonColor: "#67b2b4",
        });
        return;
      }

      try {
        await registrarUsuario(this.correo, this.contrasena);
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: `Correo "${this.correo}" registrado correctamente`,
          confirmButtonColor: "#67b2b4",
        }).then(() => {
          this.$router.push("/registrador");
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          confirmButtonColor: "#67b2b4",
        });
      }
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