<script>
import { getAuth } from "firebase/auth";
import { crearTarea, editarTarea, obtenerTareas } from "@/backend/firestore";
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
      const todas = await obtenerTareas(this.uid);
      const encontrada = todas.find((t) => t.id === this.id);
      if (encontrada) this.tarea = encontrada;
    }
  },
  methods: {
    async guardar() {
      if (this.id) {
        await editarTarea(this.uid, this.id, this.tarea);
      } else {
        await crearTarea(this.uid, this.tarea);
      }
      this.$router.push("/home");
    },
  },
};
</script>

<template>
  <EdicionDiseño 
    :id="id" 
    v-model:tarea="tarea"
    @guardar="guardar" 
  />
</template>