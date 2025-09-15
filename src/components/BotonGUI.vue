<template>
  <button class="boton" :class="tipo">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BotonGUI",
  props: {
    tipo: {
      type: String,
      default: "primario"
    }
  }
};
</script>

<style scoped>
.boton {
  padding: 0.8rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  width: 250px;
  text-align: center;
}

.primario {
  background-color: #67b2b4;
  color: white;
  border: none;
}

.primario:hover {
  background-color: #7bc4c6;
  transform: scale(1.05);
}

.primario:active {
  background-color: #53999b;
  transform: scale(0.95);
}

.secundario {
  background-color: white;
  color: #67b2b4;
  border: 2px solid #67b2b4;
}

.secundario:hover {
  background-color: #f0fafa;
  transform: scale(1.05);
}

.secundario:active {
  background-color: #e0f3f3;
  transform: scale(0.95);
}
</style>
