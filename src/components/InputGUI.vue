<template>
  <div class="input-contenedor">
    <label v-if="etiqueta">{{ etiqueta }}</label>
    <input 
      :type="tipo" 
      :placeholder="placeholder" 
      v-model="valorInterno"
      @input="$emit('update:modelValue', valorInterno)"
    />
  </div>
</template>

<script>
export default {
  name: "InputGUI",
  props: {
    tipo: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    etiqueta: { type: String, default: "" },
    modelValue: { type: String, default: "" }
  },
  data() {
    return {
      valorInterno: this.modelValue
    };
  },
  watch: {
    modelValue(nuevo) {
      this.valorInterno = nuevo;
    }
  }
};
</script>

<style scoped>
.input-contenedor {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>