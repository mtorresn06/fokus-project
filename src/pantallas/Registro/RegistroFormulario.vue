<template>
  <div class="formulario">
    <!-- Correo -->
    <input type="text" placeholder="Correo" v-model="localCorreo" />

    <!-- Contraseña -->
    <div class="campo-password">
      <input
        :type="localMostrarPassword ? 'text' : 'password'"
        placeholder="Contraseña"
        v-model="localContrasena"
      />
      <button type="button" class="ojito" @click="togglePassword">
        {{ localMostrarPassword ? "🙈" : "🙉" }}
      </button>
    </div>

    <!-- Confirmar contraseña -->
    <div class="campo-password">
      <input
        :type="localMostrarConfirmar ? 'text' : 'password'"
        placeholder="Confirmar contraseña"
        v-model="localConfirmar"
      />
      <button type="button" class="ojito" @click="toggleConfirmar">
        {{ localMostrarConfirmar ? "🙈" : "🙉" }}
      </button>
    </div>

    <!-- Botón registrar -->
    <button class="btn-registrar" @click="registrarUsuarioClick">
      Registrar
    </button>
  </div>
</template>

<script>
import { registrarUsuario } from "@/backend/autenticacion";
import Swal from "sweetalert2";

export default {
  name: "RegistroFormulario",
  props: {
    correo: String,
    contrasena: String,
    confirmar: String,
    mostrarPassword: Boolean,
    mostrarConfirmar: Boolean,
  },
  emits: [
    "update:correo",
    "update:contrasena",
    "update:confirmar",
    "update:mostrarPassword",
    "update:mostrarConfirmar",
  ],
  computed: {
    localCorreo: {
      get() {
        return this.correo;
      },
      set(value) {
        this.$emit("update:correo", value);
      },
    },
    localContrasena: {
      get() {
        return this.contrasena;
      },
      set(value) {
        this.$emit("update:contrasena", value);
      },
    },
    localConfirmar: {
      get() {
        return this.confirmar;
      },
      set(value) {
        this.$emit("update:confirmar", value);
      },
    },
    localMostrarPassword: {
      get() {
        return this.mostrarPassword;
      },
      set(value) {
        this.$emit("update:mostrarPassword", value);
      },
    },
    localMostrarConfirmar: {
      get() {
        return this.mostrarConfirmar;
      },
      set(value) {
        this.$emit("update:mostrarConfirmar", value);
      },
    },
  },
  methods: {
    togglePassword() {
      this.$emit("update:mostrarPassword", !this.mostrarPassword);
    },
    toggleConfirmar() {
      this.$emit("update:mostrarConfirmar", !this.mostrarConfirmar);
    },
    async registrarUsuarioClick() {
      if (this.localContrasena !== this.localConfirmar) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Las contraseñas no coinciden",
          confirmButtonColor: "#67b2b4",
        });
        return;
      }

      try {
        await registrarUsuario(this.localCorreo, this.localContrasena);
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: `Correo "${this.localCorreo}" registrado correctamente`,
          confirmButtonColor: "#67b2b4",
        }).then(() => {
          this.$router.push("/login");
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
  },
};
</script>

<style scoped>
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

.btn-registrar {
  background-color: #67b2b4;
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: 0.2s;
}

.btn-registrar:hover {
  background-color: #55989a;
}
</style>