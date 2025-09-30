<script>
import { getAuth } from "firebase/auth";
// Asumo que estas funciones ya están correctamente definidas en sus rutas
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
      try {
        const todas = await obtenerTareas(this.uid);
        const encontrada = todas.find((t) => t.id === this.id);
        
        if (encontrada) {
          let fechaFormateada = "";
          
          if (encontrada.fechaLimite) {
            let fechaOriginal = new Date(encontrada.fechaLimite);
            
            if (!isNaN(fechaOriginal)) {
              fechaFormateada = fechaOriginal.toISOString().substring(0, 10);
            }
          }

          this.tarea = {
            ...encontrada,
            fechaLimite: fechaFormateada,
            estado: encontrada.estado || "Pendiente",
            importancia: encontrada.importancia || "baja",
          };
        }
      } catch (error) {
          console.error("Error al cargar la tarea para edición:", error);
      }
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
    regresar() {
      console.log("Navegando a Home desde el botón de Regresar."); 
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
    @regresar="regresar" 
  />
</template>
