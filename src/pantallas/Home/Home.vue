<template>
  <div class="container">
    <div class="header">
      <h1 class="titulo">Mis Tareas</h1>
      <button class="icono-perfil-btn" @click="irAPerfil">
        <i class="fa-solid fa-user-circle"></i>
      </button>
    </div>

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

    <button class="btn-nueva" @click="irACrear">
      <i class="fa-solid fa-plus"></i> Nueva tarea
    </button>

    <ul class="lista">
      <li v-for="t in tareasFiltradas" :key="t.id" class="item">
        <div class="info">
          <span :class="['importancia-dot', colorImportancia(t.importancia)]"></span>
          <h3 class="titulo-tarea">
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
    irAPerfil() {
      this.$router.push({ name: "PerfilGUI" });
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
/* ====== CONTENEDOR GENERAL ====== */
.container {
  max-width: 700px;
  margin: 40px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-in-out;
}

/* Animación de entrada */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== ENCABEZADO ====== */
.header {
  display: flex;
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center;
  margin-bottom: 20px;
  position: relative; /* Para posicionar el botón de perfil de forma absoluta */
}

/* ====== TÍTULO ====== */
.titulo {
  font-size: 26px;
  font-weight: 700;
  color: #28a5a7;
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center; /* Asegura el centrado si el flex no lo hace para el texto en sí */
  flex-grow: 1; /* Permite que el título ocupe el espacio disponible para centrarse */
}

/* ====== BOTÓN PERFIL ====== */
.icono-perfil-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #28a5a7;
  cursor: pointer;
  padding: 5px;
  transition: all 0.25s ease;
  line-height: 1;
  position: absolute; /* Posicionamiento absoluto */
  right: 0; /* A la derecha del `header` */
  top: 50%; /* Centra verticalmente */
  transform: translateY(-50%); /* Ajusta para centrado perfecto */
}
.icono-perfil-btn:hover {
  color: #2ec8c8;
  transform: translateY(-50%) scale(1.1); /* Ajusta la transformación para el hover */
  filter: drop-shadow(0 0 5px rgba(40, 165, 167, 0.5));
}

/* ====== FILTROS ====== */
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}
.filtro-btn {
  background: #ecfafa;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
  color: #28a5a7;
}
.filtro-btn:hover {
  background: #d5f5f5;
  transform: translateY(-2px);
}
.filtro-btn.activo {
  background: #28a5a7;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(40, 165, 167, 0.3);
}

/* ====== BOTÓN NUEVA TAREA ====== */
.btn-nueva {
  background: linear-gradient(135deg, #28a5a7, #2ec8c8);
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 14px rgba(40, 165, 167, 0.3);
}
.btn-nueva:hover {
  background: linear-gradient(135deg, #1e8d8d, #28a5a7);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 18px rgba(40, 165, 167, 0.4);
}

/* ====== LISTA DE TAREAS ====== */
.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfefe;
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 12px;
  border: 1px solid #e6f4f4;
  transition: all 0.25s ease;
}
.item:hover {
  background: #f0fafa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 165, 167, 0.15);
}

.info {
  display: flex; /* Para alinear la bolita y el título */
  align-items: center;
  gap: 10px; /* Espacio entre la bolita y el título */
  flex-grow: 1; /* Permite que la info ocupe el espacio disponible */
}

.titulo-tarea {
  margin: 0; /* Elimina márgenes predeterminados del h3 */
  font-size: 17px;
  color: #333; /* Color de texto más neutral para el título de la tarea */
  font-weight: 600;
}

small {
  margin-left: auto; /* Empuja la pequeña información a la derecha si es necesario */
  color: #777;
  font-size: 12px;
  white-space: nowrap; /* Evita que la fecha/estado se rompa en varias líneas */
}

/* ====== BOLITA DE IMPORTANCIA (NUEVO) ====== */
.importancia-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0; /* Evita que la bolita se encoja */
}
/* Colores de las bolitas */
.importancia-dot.rojo { background-color: #e74c3c; }
.importancia-dot.naranja { background-color: #e67e22; }
.importancia-dot.verde { background-color: #27ae60; }


/* ====== COLORES DE IMPORTANCIA (MODIFICADO) ====== */
.rojo { color: #e74c3c; } 
.naranja { color: #e67e22; }
.verde { color: #27ae60; }

/* ====== ACCIONES ====== */
.acciones {
display: flex;
  gap: 15px; /* Mayor separación entre los botones de acción */
  margin-left: 20px; /* Aumenta el espacio de separación con la fecha/texto */
  flex-shrink: 0; /* Asegura que no se encoja para mantener la separación */
}
.icono-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.icono-btn:hover {
  transform: scale(1.2);
}
.editar { color: #2980b9; }
.eliminar { color: #e74c3c; }
</style>