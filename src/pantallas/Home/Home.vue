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

    <!-- Clase dinámica 'compacta' basada en el estado del switch -->
    <ul :class="['lista', { 'compacta': vistaCompactaActiva }]">
      <li 
        v-for="t in tareasFiltradas" 
        :key="t.id" 
        :class="['item', estadoColorClass(t)]"
      >
        <div class="content-wrapper">
          <div class="info">
            <!-- La bolita sigue indicando solo Importancia -->
            <span :class="['importancia-dot', colorImportancia(t.importancia)]"></span>
            <h3 class="titulo-tarea">
              {{ t.titulo }}
            </h3>
            <small>
              <span v-if="isDueToday(t)" class="due-today">Vence HOY</span>
              <span v-else-if="isOverdue(t)" class="due-overdue">Vencida</span>
              <span v-else>{{ t.estado }}</span>
               • Fecha límite: {{ t.fechaLimite || "—" }}
            </small>
          </div>

          <div class="acciones">
            <button @click="toggleDescripcion(t.id)" class="icono-btn descripcion-btn">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button @click="irAEditar(t.id)" class="icono-btn editar">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click="eliminar(t.id)" class="icono-btn eliminar">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="descripcion-desplegable" v-if="tareaAbiertaId === t.id">
          <p class="descripcion-texto">
            {{ t.descripcion || "No hay descripción detallada para esta tarea." }}
          </p>
        </div>
      </li>
    </ul>
    
    <p v-if="tareas.length === 0 && !uid" class="mensaje-vacio">
      Inicia sesión para cargar tus tareas.
    </p>
    <p v-else-if="tareas.length === 0" class="mensaje-vacio">
      ¡No tienes tareas! Usa el botón "Nueva tarea" para empezar.
    </p>
    <p v-else-if="tareasFiltradas.length === 0" class="mensaje-vacio">
      No hay tareas en el filtro "{{ filtro }}".
    </p>
  </div>
</template>

<script>
import { obtenerTareas, borrarTarea } from "@/backend/firestore";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2';

// Función de utilidad: Comprueba si la fecha ya pasó (vencida)
const isDatePast = (dateString) => {
  if (!dateString) return false;
  const taskDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);
  return taskDate < today;
};

// Función de utilidad: Comprueba si la fecha es hoy
const isDateToday = (dateString) => {
  if (!dateString) return false;
  const taskDate = new Date(dateString);
  const today = new Date();
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
};


export default {
  data() {
    return {
      tareas: [],
      uid: null,
      filtro: "Todas",
      filtros: ["Todas", "Pendientes", "Completadas", "Importantes", "Vencidas"],
      tareaAbiertaId: null,
      vistaCompactaActiva: false, 
    };
  },
  async mounted() {
    const auth = getAuth();
    this.uid = auth.currentUser?.uid;
    this.cargarEstadoVistaCompacta();
    
    if (this.uid) {
      this.cargarTareas();
    }
  },
  computed: {
    tareasFiltradas() {
      let tempTareas = this.tareas;

      if (this.filtro === "Todas") return tempTareas;
      if (this.filtro === "Pendientes")
        return tempTareas.filter((t) => (t.estado === "Pendiente" || t.estado === "En Progreso") && !this.isOverdue(t));
      if (this.filtro === "Completadas")
        return tempTareas.filter((t) => t.estado === "Completada");
      if (this.filtro === "Importantes")
        return tempTareas.filter((t) => t.importancia === "alta");
        
      // Lógica: Tarea vencida es aquella cuya fecha límite ya pasó Y no está completada
      if (this.filtro === "Vencidas")
        return tempTareas.filter((t) => this.isOverdue(t) && t.estado !== 'Completada');
        
      return tempTareas;
    },
  },
  methods: {
    // NUEVO MÉTODO: Determina la clase CSS para el borde izquierdo del estado.
    estadoColorClass(tarea) {
      if (this.isOverdue(tarea)) {
        return 'border-vencida'; // Rojo
      }
      if (this.isDueToday(tarea)) {
        return 'border-hoy'; // Naranja
      }
      if (tarea.estado === 'Completada') {
        return 'border-completada'; // Verde
      }
      // Por defecto para "Pendiente" o "En Progreso"
      if (tarea.estado === 'Pendiente' || tarea.estado === 'En Progreso') {
        return 'border-pendiente'; // Azul/Cyan del programa
      }
      return ''; // Sin borde especial para otros estados
    },

    cargarEstadoVistaCompacta() {
        const storedValue = localStorage.getItem('vistaCompactaActiva');
        this.vistaCompactaActiva = storedValue === 'true';
    },

    // MÉTODOS DE UTILIDAD
    isDueToday(tarea) {
        return tarea.estado !== 'Completada' && isDateToday(tarea.fechaLimite);
    },
    
    isOverdue(tarea) {
        return tarea.estado !== 'Completada' && isDatePast(tarea.fechaLimite);
    },

    toggleDescripcion(id) {
      if (this.tareaAbiertaId === id) {
        this.tareaAbiertaId = null;
      } else {
        this.tareaAbiertaId = id;
      }
    },
    async cargarTareas() {
      this.tareas = await obtenerTareas(this.uid);
      this.cargarEstadoVistaCompacta();
    },
    async eliminar(id) {
      // Usamos SweetAlert2 para la confirmación en lugar de alert/confirm
      const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#e74c3c',
          cancelButtonColor: '#28a5a7',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
          try {
              await borrarTarea(this.uid, id);
              this.cargarTareas();
              Swal.fire(
                  '¡Eliminada!',
                  'Tu tarea ha sido eliminada.',
                  'success'
              );
          } catch (error) {
              console.error("Error al borrar tarea:", error);
              Swal.fire(
                  'Error',
                  'Hubo un problema al eliminar la tarea.',
                  'error'
              );
          }
      }
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
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

/* ====== TÍTULO ====== */
.titulo {
  font-size: 26px;
  font-weight: 700;
  color: #28a5a7;
  letter-spacing: 0.5px;
  margin: 0;
  text-align: center; 
  flex-grow: 1;
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
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.icono-perfil-btn:hover {
  color: #2ec8c8;
  transform: translateY(-50%) scale(1.1);
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

/* Estilo por defecto del item */
.item {
  display: flex;
  flex-direction: column;
  background: #fdfefe;
  border-radius: 14px;
  padding: 14px 18px; /* Padding estándar */
  margin-bottom: 12px;
  border: 1px solid #e6f4f4;
  transition: all 0.25s ease;
  border-left: 5px solid #e6f4f4; /* Borde predeterminado sutil */
}

.item:hover {
  background: #f0fafa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 165, 167, 0.15);
}

/* --- ESTILOS DE BORDE POR ESTADO (NUEVOS) --- */
.item.border-vencida {
    border-left: 5px solid #e74c3c; /* Rojo: Urgente */
}
.item.border-hoy {
    border-left: 5px solid #e67e22; /* Naranja: Advertencia */
}
.item.border-pendiente {
    border-left: 5px solid #3498db; /* Azul: Pendiente */
}
.item.border-completada {
    border-left: 5px solid #2ecc71; /* Verde: Éxito */
}
/* FIN DE ESTILOS DE BORDE */

/* ESTILOS PARA VISTA COMPACTA */
.lista.compacta .item {
    padding: 8px 14px; /* Padding reducido */
    border-radius: 10px;
    margin-bottom: 8px;
}

.lista.compacta .titulo-tarea {
    font-size: 16px; /* Tamaño de fuente ligeramente menor */
}

.lista.compacta small {
    font-size: 11px; /* Tamaño de fuente menor para la metadata */
}

.lista.compacta .importancia-dot {
    width: 10px; /* Bolita más pequeña */
    height: 10px;
}

.lista.compacta .acciones .icono-btn {
    font-size: 16px; /* Iconos más pequeños */
    padding: 0;
}
/* FIN DE ESTILOS VISTA COMPACTA */

/* Eliminamos los selectores que ya no necesitamos gracias a las nuevas clases de borde */
/* .item:has(.due-today) { border-left: 5px solid #e67e22; }
.item:has(.due-overdue) { border-left: 5px solid #e74c3c; } */


.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.info {
  display: flex; /* Para alinear la bolita y el título */
  align-items: center;
  gap: 10px; /* Espacio entre la bolita y el título */
  flex-grow: 1; /* Permite que la info ocupe el espacio disponible */
  min-width: 0; 
}

.titulo-tarea {
  margin: 0; /* Elimina márgenes predeterminados del h3 */
  font-size: 17px;
  color: #333; /* Color de texto más neutral para el título de la tarea */
  font-weight: 600;
  white-space: nowrap; /* Evita el salto de línea */
  overflow: hidden; /* Oculta el texto extra */
  text-overflow: ellipsis; /* Añade puntos suspensivos */
}
.lista.compacta .titulo-tarea {
  max-width: 180px; /* Limita el ancho del título en vista compacta */
}


small {
  margin-left: 20px; /* Empuja la pequeña información a la derecha */
  color: #777;
  font-size: 12px;
  white-space: nowrap; /* Evita que la fecha/estado se rompa en varias líneas */
  display: flex; /* Para poder aplicar estilos específicos a los spans internos */
  gap: 8px;
  align-items: center;
  flex-shrink: 0; /* Evita que se encoja cuando el título es muy largo */
}

.due-today {
    color: #e67e22; /* Naranja */
    font-weight: 700;
    background-color: #fff3e0;
    padding: 2px 6px;
    border-radius: 4px;
}

.due-overdue {
    color: #e74c3c; /* Rojo */
    font-weight: 700;
    background-color: #fceaea;
    padding: 2px 6px;
    border-radius: 4px;
}


/* ====== BOLITA DE IMPORTANCIA ====== */
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

/* ====== ACCIONES ====== */
.acciones {
display: flex;
  gap: 15px; /* Mayor separación entre los botones de acción */
  margin-left: 20px;
  flex-shrink: 0; 
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
.descripcion-btn {
  color: #3498db; 
}
.editar { color: #2980b9; }
.eliminar { color: #e74c3c; }

/* ====== ESTILOS PARA EL DESPLEGABLE ====== */
.descripcion-desplegable {
  border-top: 1px solid #f0fafa; 
  padding-top: 10px;
  margin-top: 10px;
  width: 100%;
}

.descripcion-texto {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.mensaje-vacio {
    text-align: center;
    color: #777;
    padding: 30px;
    font-style: italic;
    border: 1px dashed #e6f4f4;
    border-radius: 10px;
    margin-top: 20px;
}

/* MEDIA QUERIES PARA RESPONSIVIDAD */
@media (max-width: 600px) {
    .container {
        margin: 20px auto;
        padding: 15px;
        border-radius: 12px;
    }
    
    .item {
        padding: 10px 12px; 
    }

    .titulo {
        font-size: 22px;
    }

    .icono-perfil-btn {
        font-size: 28px;
    }
    
    .content-wrapper {
        align-items: flex-start;
    }

    .info {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        flex-basis: 70%;
    }

    .importancia-dot {
        display: none;
    }

    .titulo-tarea {
        font-size: 15px;
        white-space: normal; 
        overflow: visible;
        text-overflow: clip;
        max-width: 100%;
        margin-bottom: 4px;
    }

    small {
        margin-left: 0;
        font-size: 11px;
    }

    .acciones {
        margin-left: 10px;
        gap: 10px;
        flex-basis: 30%;
        justify-content: flex-end;
        margin-top: 5px;
    }

    .descripcion-desplegable {
        padding-top: 8px;
        margin-top: 8px;
    }
    
    .lista.compacta .item {
        padding: 8px 10px;
    }
}
</style>