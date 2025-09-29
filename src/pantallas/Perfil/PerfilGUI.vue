<template>
  <div class="container-perfil">
    <button class="btn-regresar" @click="regresar">
      <i class="fa-solid fa-arrow-left"></i> Volver a Tareas
    </button>
    
    <div class="tarjeta-perfil">
      <h1 class="titulo">Configuración de Perfil</h1>

      <div v-if="usuario" class="secciones-datos">
        
        <div class="seccion">
          <h2 class="subtitulo">Correo</h2>
          <p class="valor">{{ usuario.email }}</p>
        </div>

        <div class="seccion">
          <h2 class="subtitulo">Contraseña</h2>
          <div class="password-field">
            <p class="valor">••••••••••••</p> 
            <button class="icono-btn editar-pass" @click="iniciarEdicionContrasena">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="seccion configuracion">
          <h2 class="subtitulo">Configuración de notificaciones</h2>
          <div class="opcion">
            <p class="etiqueta-opcion">Recordatorio de tareas próximas</p>
            <label class="switch">
              <input type="checkbox" v-model="notificacionesActivas">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <div v-else class="cargando">
        <i class="fa-solid fa-spinner fa-spin"></i> Cargando datos del usuario...
      </div>
      
      <button class="btn-logout" @click="manejarCerrarSesion" :disabled="cargandoLogout">
  {{ cargandoLogout ? 'Cerrando Sesión...' : 'Cerrar Sesión' }}
</button>
      
      <p v-if="errorLogout" class="error-message">{{ errorLogout }}</p>
      
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { cerrarSesion } from "@/backend/autenticacion"; 

export default {
  data() {
    return {
      usuario: null,
      notificacionesActivas: true, 
      errorLogout: null,
      cargandoLogout: false 
    };
  },
  
  created() {
    const auth = getAuth();
    this.usuario = auth.currentUser;
    auth.onAuthStateChanged((user) => {
        this.usuario = user;
    });
  },

  methods: {
    regresar() {
      // Usamos el path que ya confirmamos que funciona
      this.$router.push('/home'); 
    },
    
  async manejarCerrarSesion() {
            this.errorLogout = null;
            this.cargandoLogout = true;
            try {
                await cerrarSesion(); 
                this.$router.push({ name: 'Login' });
            } catch (error) {
                console.error("Error al cerrar sesión:", error.code, error.message);
                this.errorLogout = "Error al cerrar sesión. Verifica tu conexión.";
                } finally {
        this.cargandoLogout = false;
            }
        },

    iniciarEdicionContrasena() {
        // 1. Mostrar un modal o un formulario.
        // 2. Pedir la contraseña actual.
        // 3. Pedir la nueva contraseña (dos veces).
        // 4. Llamar a una función de Firebase (updatePassword o similar).
        
    }
  },
};
</script>

<style scoped>
/* ====== CONTENEDOR GENERAL ====== */
.container-perfil {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  animation: fadeIn 0.6s ease-in-out;
}

/* Animación de entrada */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilo para la tarjeta principal del perfil */
.tarjeta-perfil {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-top: 20px;
}

/* Indicador de carga */
.cargando {
    text-align: center;
    color: #28a5a7;
    font-size: 16px;
    padding: 20px 0;
}
.cargando .fa-spin {
    margin-right: 8px;
}

/* ====== TÍTULO ====== */
.titulo {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #28a5a7;
  text-align: center;
  border-bottom: 2px solid #e6f4f4;
  padding-bottom: 15px;
}

/* ====== SECCIONES DE DATOS ====== */
.seccion {
  margin-bottom: 25px;
}

.subtitulo {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.valor {
  font-size: 18px;
  color: #222;
  margin: 0;
  padding-left: 10px;
  font-weight: 400;
}

/* Estilo para la sección de configuración/toggle */
.configuracion {
  border-top: 1px solid #eee;
  padding-top: 25px;
}

.opcion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.etiqueta-opcion {
  font-size: 16px;
  color: #222;
  margin: 0;
}

/* ====== CAMPO CONTRASEÑA ====== */
.password-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
}

.password-field .valor {
  /* Estilo específico para los puntos de la contraseña */
  flex-grow: 1; 
  letter-spacing: 2px;
  font-weight: bold;
}

.editar-pass {
  background: none;
  border: none;
  color: #28a5a7;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  padding: 5px;
}

.editar-pass:hover {
  color: #2ec8c8;
  transform: scale(1.1);
}

/* ====== MENSAJE DE ERROR (Logout) ====== */
.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #e74c3c50;
  background-color: #ffeaea;
  border-radius: 8px;
  font-size: 14px;
}

/* ====== BOTÓN DE REGRESAR ====== */
.btn-regresar {
  background: none;
  border: none;
  color: #28a5a7;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  transition: color 0.2s;
  font-size: 15px;
}

.btn-regresar:hover {
  color: #2ec8c8;
}

/* ====== BOTÓN CERRAR SESIÓN ====== */
.btn-logout {
  width: 100%;
  background: #e74c3c;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  margin-top: 30px;
  transition: background 0.3s ease;
}

.btn-logout:hover {
  background: #c0392b;
}

/* ====== ESTILOS DEL TOGGLE (SWITCH) ====== */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px; /* Estilo redondeado */
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%; /* Estilo redondeado */
}

input:checked + .slider {
  background-color: #28a5a7;
}

input:focus + .slider {
  box-shadow: 0 0 1px #28a5a7;
}

input:checked + .slider:before {
  transform: translateX(22px);
}
</style>