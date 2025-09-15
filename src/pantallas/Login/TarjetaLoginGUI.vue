<template>
  <div class="tarjeta-login">
    <LogoLoginGUI />

    <div class="formulario">
      <input 
        type="text" 
        placeholder="Usuario" 
        v-model="usuario"
      />

      <div class="campo-password">
        <input 
          :type="mostrarPassword ? 'text' : 'password'" 
          placeholder="Contraseña" 
          v-model="contrasena"
        />
        <button type="button" class="ojito" @click="togglePassword">
          {{ mostrarPassword ? '🙈' : '🙉' }}
        </button>
      </div>
    </div>

    <BotonGUI tipo="primario" @click="iniciarSesion">Entrar</BotonGUI>

    <p class="registro">
      ¿Todavía no tienes una cuenta?
      <span @click="irARegistro">Regístrate</span>
    </p>
  </div>
</template>

<script>
import LogoLoginGUI from "./LogoLoginGUI.vue";
import BotonGUI from "../../components/BotonGUI.vue";
import Swal from "sweetalert2";

export default {
  name: "TarjetaLoginGUI",
  components: { LogoLoginGUI, BotonGUI },
  data() {
    return {
      usuario: "",
      contrasena: "",
      mostrarPassword: false
    };
  },
  methods: {
    togglePassword() {
      this.mostrarPassword = !this.mostrarPassword;
    },
    iniciarSesion() {
      Swal.fire({
        title: "¡Bienvenido!",
        text: `Has iniciado sesión como ${this.usuario}`,
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#67b2b4"
      }).then(() => {
        this.$router.push("/registrador"); 
      });
    },
    irARegistro() {
      this.$router.push("/registro");
    }
  }
};
</script>

<style scoped>
.tarjeta-login {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.formulario input {
  padding: 0.9rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}

.formulario input:focus {
  border-color: #67b2b4;
  box-shadow: 0 0 5px rgba(103, 178, 180, 0.3);
}

.campo-password {
  display: flex;
  align-items: center;
  position: relative;
}

.campo-password input {
  flex: 1;
}

.ojito {
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.registro {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #555;
}

.registro span {
  color: #67b2b4;
  cursor: pointer;
  font-weight: bold;
}
</style>