<template>
  <div class="container">
    <h1 class="titulo">Mis Tareas</h1>

    <!-- Filtros -->
    <div class="filtros">
      <button
        v-for="f in filtros"
        :key="f"
        :class="['filtro-btn', { activo: filtro === f }]"
        @click="filtro = f"
      >
        {{ f }}
      </button>
    </div>

    <!-- Botón crear -->
    <button class="btn-nueva" @click="irACrear">
      <i class="fa-solid fa-plus"></i> Nueva tarea
    </button>

    <!-- Lista filtrada -->
    <ul class="lista">
      <li v-for="t in tareasFiltradas" :key="t.id" class="item">
        <div class="info">
          <h3 :class="colorImportancia(t.importancia)">
            {{ t.titulo }}
          </h3>
          <small>{{ t.estado }} • Fecha límite: {{ t.fechaLimite || "—" }}</small>
        </div>

        <div class="acciones">
          <button @click="irAEditar(t.id)" class="icono-btn editar">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button @click="eliminar(t.id)" class="icono-btn eliminar">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { obtenerTareas, borrarTarea } from "@/backend/firestore";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      tareas: [],
      uid: null,
      filtro: "Todas",
      filtros: ["Todas", "Pendientes", "Completadas", "Importantes"],
    };
  },
  async mounted() {
    const auth = getAuth();
    this.uid = auth.currentUser?.uid;
    if (this.uid) {
      this.cargarTareas();
    }
  },
  computed: {
    tareasFiltradas() {
      if (this.filtro === "Todas") return this.tareas;
      if (this.filtro === "Pendientes")
        return this.tareas.filter((t) => t.estado === "Pendiente");
      if (this.filtro === "Completadas")
        return this.tareas.filter((t) => t.estado === "Completada");
      if (this.filtro === "Importantes")
        return this.tareas.filter((t) => t.importancia === "alta");
      return this.tareas;
    },
  },
  methods: {
    async cargarTareas() {
      this.tareas = await obtenerTareas(this.uid);
    },
    async eliminar(id) {
      await borrarTarea(this.uid, id);
      this.cargarTareas();
    },
    irACrear() {
      this.$router.push({ name: "NuevaTarea" });
    },
    irAEditar(id) {
      this.$router.push({ name: "EditarTarea", params: { id } });
    },
    colorImportancia(nivel) {
      if (nivel === "alta") return "rojo";
      if (nivel === "media") return "naranja";
      return "verde";
    },
  },
};
</script>

<style scoped>
/* contenedor */
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* título */
.titulo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2c3e50;
}

/* filtros */
.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.filtro-btn {
  background: #ecf0f1;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
}
.filtro-btn.activo {
  background: #28a5a7;
  color: white;
}

/* botón nueva tarea */
.btn-nueva {
  background: #28a5a7;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* lista */
.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
}

/* colores importancia */
.rojo {
  color: #c0392b;
}
.naranja {
  color: #e67e22;
}
.verde {
  color: #27ae60;
}

/* acciones */
.acciones {
  display: flex;
  gap: 8px;
}
.icono-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.editar {
  color: #2980b9;
}
.eliminar {
  color: #c0392b;
}
</style>