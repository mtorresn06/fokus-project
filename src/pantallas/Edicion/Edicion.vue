<template>
  <EdicionDiseño 
    :id="id" 
    v-model:tarea="tarea"
    @guardar="guardar" 
    @regresar="regresar" 
  />
</template>

<script>
import { getAuth } from "firebase/auth";
import EdicionDiseño from "./EdicionDiseño.vue"; 

export default {
  props: ["id"],
  components: { EdicionDiseño },
  data() {
    return {
      uid: null,
      tarea: {
        titulo: "",
        descripcion: "",
        estado: "Pendiente",
        fechaLimite: "",
        importancia: "baja",
      },
    };
  },
  async mounted() {
    const auth = getAuth();
    this.uid = auth.currentUser?.uid;

    if (this.id) {
      const todas = []; 
      const encontrada = todas.find((t) => t.id === this.id);
      if (encontrada) this.tarea = encontrada;
    }
  },
  methods: {
    async guardar() {
      this.$router.push("/home");
    },
    regresar() {
      this.$router.push("/home");
    },
  },
};
</script>