<template>
  <div class="formulario">
    <input type="text" placeholder="Usuario" v-model="localUsuario" />

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
    <button class="btn-registrar" @click="$emit('registrar')">
      Registrar
    </button>
  </div>
</template>

<script>
export default {
  name: "RegistroFormulario",
  props: {
    usuario: String,
    contrasena: String,
    confirmar: String,
    mostrarPassword: Boolean,
    mostrarConfirmar: Boolean,
  },
  emits: [
    "update:usuario",
    "update:contrasena",
    "update:confirmar",
    "update:mostrarPassword",
    "update:mostrarConfirmar",
    "registrar",
  ],
  computed: {
    localUsuario: {
      get() {
        return this.usuario;
      },
      set(value) {
        this.$emit("update:usuario", value);
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