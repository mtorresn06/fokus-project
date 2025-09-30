<template>
  <div class="container">
    <!-- 1. AÑADIDO: Botón de Regreso que EMITE el evento 'regresar' -->
    <button class="btn-regresar" @click="$emit('regresar')">
      <i class="fa-solid fa-arrow-left"></i> Home
    </button>
    
    <h1 class="titulo">{{ id ? "Editar Tarea" : "Nueva Tarea" }}</h1>

    <form @submit.prevent="$emit('guardar')" class="formulario">
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
          <option value="En Progreso">En progreso</option>
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
export default {
  props: {
    id: String,
    tarea: Object
  },
  emits: ["guardar", "update:tarea", "regresar"], 
};
</script>

<style scoped>
/* 3. ESTILOS ACTUALIZADOS (Fondo Pastel + Correcciones de Padding) */

/* ====== GENERAL (Fondo Celeste Pastel Suave) ====== */
.body {
    background: #ecfafa;
    font-family: "Poppins", "Segoe UI", Roboto, sans-serif;
    color: #2c3e50;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
}

/* ====== CONTENEDOR TARJETA  ====== */
.container {
    max-width: 650px;
    width: 100%;
    margin: 40px auto;
    padding: 40px;
    background: #ffffff;
    border-radius: 22px;
    /* Sombra suave aprobada */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
    position: relative;
    z-index: 2;
    animation: fadeIn 0.6s ease;
    box-sizing: border-box;
    padding-top: 60px;  
}

/* Animación de entrada */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ====== BOTÓN DE REGRESAR (Home) ====== */
.btn-regresar {
    position: absolute;
    top: 25px; 
    left: 10px; 
    background: none;
    border: none;
    color: #28a5a7; 
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s, background-color 0.2s;
    font-size: 15px;
    padding: 5px 10px;
    border-radius: 8px;
}

.btn-regresar:hover {
    color: #1e8d8d;
    background-color: #e6f4f4;
}

/* ====== TÍTULO ====== */
.titulo {
    font-size: 28px;
    font-weight: 700;
    color: #0f8f88;
    text-align: center;
    margin-bottom: 28px;
    letter-spacing: 0.6px;
    margin-top: 0;
}

/* ====== FORMULARIO ====== */
.formulario {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.campo span {
    font-weight: 600;
    color: #34495e;
    margin-bottom: 8px;
    display: inline-block;
    font-size: 15px;
}

/* ====== INPUTS & SELECTS (Fix de padding para la flecha) ====== */
input,
textarea,
select {
    width: 100%;
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left: 16px; 
    padding-right: 40px; 
    
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    font-size: 15px;
    background: #ffffff;
    transition: all 0.25s ease;
    box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #28a5a7;
    box-shadow: 0 0 0 3px rgba(40, 165, 167, 0.15);
}

textarea {
    resize: none;
    min-height: 110px;
    padding-right: 16px; 
}
input[type="text"], input[type="date"] {
    padding-right: 16px;
}
select {
    padding-right: 16px; 
        cursor: pointer;
}

/* ====== BOTONES ====== */
.acciones {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.btn-guardar {
    background: linear-gradient(135deg, #28a5a7, #2ec8c8);
    color: #fff;
    padding: 14px 32px;
    border: none;
    border-radius: 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 14px rgba(40, 165, 167, 0.25);
    min-width: 180px;
    text-align: center;
}
.btn-guardar:hover {
    background: linear-gradient(135deg, #1e8d8d, #28a5a7);
    box-shadow: 0 8px 18px rgba(40, 165, 167, 0.35);
    transform: translateY(-2px) scale(1.02);
}
</style>
