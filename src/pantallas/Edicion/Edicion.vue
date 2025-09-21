<template>
  <div class="container">
    <h1 class="titulo">{{ id ? "Editar Tarea" : "Nueva Tarea" }}</h1>

    <form @submit.prevent="guardar" class="formulario">
      <label class="campo">
        <span>Título</span>
        <input v-model="tarea.titulo" type="text" required />
      </label>

      <label class="campo">
        <span>Descripción</span>
        <textarea v-model="tarea.descripcion"></textarea>
      </label>

      <label class="campo">
        <span>Estado</span>
        <select v-model="tarea.estado">
          <option>Pendiente</option>
          <option>En progreso</option>
          <option>Completada</option>
        </select>
      </label>

      <label class="campo">
        <span>Fecha límite</span>
        <input type="date" v-model="tarea.fechaLimite" />
      </label>

      <label class="campo">
        <span>Nivel de importancia</span>
        <select v-model="tarea.importancia">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </label>

      <div class="acciones">
        <button type="submit" class="btn-guardar">Guardar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { crearTarea, editarTarea, obtenerTareas } from "@/backend/firestore";

export default {
  props: ["id"],
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

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.titulo {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo span {
  font-weight: bold;
  color: #2c3e50;
  display: block;
  margin-bottom: 6px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

textarea {
  resize: none;
  min-height: 80px;
}

.acciones {
  display: flex;
  justify-content: flex-end;
}

.btn-guardar {
  background: #28a5a7;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.btn-guardar:hover {
  background: #1d7c7d;
}
</style>
