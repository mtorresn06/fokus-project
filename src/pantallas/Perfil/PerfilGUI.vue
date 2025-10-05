<template>
  <div class="container-perfil">
    <button class="btn-regresar" @click="regresar">
      <i class="fa-solid fa-arrow-left"></i> Home
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

        <!-- SECCIÓN MODIFICADA: Vista Compacta -->
        <div class="seccion configuracion">
          <h2 class="subtitulo">Visualización</h2>
          <div class="opcion">
            <p class="etiqueta-opcion">Activar Vista Compacta (Más tareas por pantalla)</p>
            <label class="switch">
              <input type="checkbox" v-model="vistaCompactaActiva" @change="guardarVistaCompacta">
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
      
      <!-- BOTÓN ELIMINAR CUENTA ESTILIZADO -->
      <button 
        class="btn-eliminar-cuenta" 
        @click="manejarEliminarCuenta" 
        :disabled="cargandoEliminar"
      >
        {{ cargandoEliminar ? 'Eliminando...' : 'Eliminar Cuenta' }}
      </button>

      <p v-if="errorLogout" class="error-message">{{ errorLogout }}</p>
      
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { cerrarSesion, cambiarContrasena, eliminarCuenta } from "@/backend/autenticacion"; 
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      usuario: null,
      // MODIFICADO: Cambiado de recordatoriosActivos a vistaCompactaActiva
      vistaCompactaActiva: false, 
      errorLogout: null,
      cargandoLogout: false,
      cargandoEliminar: false,
    };
  },
  
  created() {
    const auth = getAuth();
    this.usuario = auth.currentUser;
    auth.onAuthStateChanged((user) => {
        this.usuario = user;
    });
    // NUEVO: Cargar el estado de la vista compacta al crear el componente
    this.cargarVistaCompacta();
  },

  methods: {
    // NUEVO MÉTODO
    cargarVistaCompacta() {
      const storedValue = localStorage.getItem('vistaCompactaActiva');
      // Convertir el string 'true'/'false' de localStorage a boolean
      this.vistaCompactaActiva = storedValue === 'true';
    },

    // NUEVO MÉTODO
    guardarVistaCompacta() {
      localStorage.setItem('vistaCompactaActiva', this.vistaCompactaActiva);
    },

    regresar() {
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

    async manejarEliminarCuenta() {
      if (!this.usuario) {
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
        return;
      }

      // --- PASO 1: Confirmación de Seguridad ---
      const resultadoConfirmacion = await Swal.fire({
          title: '¿Estás absolutamente seguro/a?',
          text: "¡Esta acción es irreversible! Se borrarán todas tus tareas.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, Eliminar Permanentemente',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'btn-alerta-principal-eliminar',
            cancelButton: 'btn-alerta-secundaria'
          }
      });

      if (!resultadoConfirmacion.isConfirmed) return;

      // --- PASO 2: Reautenticación por Seguridad (Pedir Contraseña) ---
      const { value: contrasenaActual } = await Swal.fire({
        title: 'Verificación de Contraseña',
        text: 'Ingresa tu contraseña actual para confirmar la eliminación de la cuenta.',
        input: 'password',
        inputPlaceholder: 'Contraseña Actual',
        showCancelButton: true,
        confirmButtonText: 'Confirmar Eliminación',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn-alerta-principal-eliminar',
          cancelButton: 'btn-alerta-secundaria'
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('La contraseña es obligatoria.');
            return false;
          }
          return value;
        }
      });

      if (!contrasenaActual) return;

      // --- PASO 3: Llamar al Backend para Eliminar ---
      this.cargandoEliminar = true;
      try {
        await eliminarCuenta(this.usuario, contrasenaActual); 
        
        Swal.fire(
          '¡Cuenta Eliminada!',
          'Tu cuenta ha sido eliminada permanentemente. Serás redirigido al inicio de sesión.',
          'success'
        ).then(() => {
          this.$router.push({ name: 'Login' });
        });

      } catch (error) {
        let mensaje = 'Ocurrió un error inesperado al eliminar la cuenta.';
        
        if (error.code === 'auth/requires-recent-login') {
             mensaje = 'Debes volver a iniciar sesión para realizar esta acción de alta seguridad.';
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
             mensaje = 'La contraseña ingresada es incorrecta. Inténtalo de nuevo.';
        } else {
             console.error("Error al eliminar cuenta:", error.code, error.message);
        }

        Swal.fire('Error', mensaje, 'error');
      } finally {
        this.cargandoEliminar = false;
      }
    },

    async iniciarEdicionContrasena() {
      if (!this.usuario) {
        Swal.fire('Error', 'No se pudieron cargar los datos del usuario.', 'error');
        return;
      }

      // --- Pedir Contraseña Actual para Reautenticación ---
      const { value: contrasenaActual } = await Swal.fire({
        title: 'Verificación de Seguridad',
        text: 'Ingresa tu contraseña actual para confirmar el cambio.',
        input: 'password',
        inputPlaceholder: 'Contraseña Actual',
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn-alerta-principal',
          cancelButton: 'btn-alerta-secundaria'
        }
      });

      if (!contrasenaActual) return; // El usuario canceló o no ingresó nada

      // --- Pedir la Nueva Contraseña ---
      const { value: formValues } = await Swal.fire({
        title: 'Nueva Contraseña',
        html:
          '<input id="swal-input1" class="swal2-input" type="password" placeholder="Nueva Contraseña">' +
          '<input id="swal-input2" class="swal2-input" type="password" placeholder="Confirmar Nueva Contraseña">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Cambiar Contraseña',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const nueva1 = document.getElementById('swal-input1').value;
          const nueva2 = document.getElementById('swal-input2').value;
          
          if (!nueva1 || !nueva2) {
            Swal.showValidationMessage('Ambos campos de contraseña son obligatorios.');
            return false;
          }
          if (nueva1 !== nueva2) {
            Swal.showValidationMessage('Las nuevas contraseñas no coinciden.');
            return false;
          }
          if (nueva1.length < 6) {
              Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres.');
              return false;
          }
          return [nueva1];
        },
        customClass: {
          confirmButton: 'btn-alerta-principal',
          cancelButton: 'btn-alerta-secundaria'
        }
      });

      if (!formValues) return; // El usuario canceló o falló la validación

      const [nuevaContrasena] = formValues;

      // --- PASO 3: Llamar al Backend de Firebase ---
      try {
        await cambiarContrasena(this.usuario, contrasenaActual, nuevaContrasena);
        Swal.fire(
          '¡Éxito!',
          'Tu contraseña ha sido actualizada correctamente.',
          'success'
        );
      } catch (error) {
        let mensaje = 'Ocurrió un error inesperado al actualizar la contraseña.';
        
        // Manejo de errores comunes de Firebase
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            mensaje = 'La contraseña actual ingresada es incorrecta. Inténtalo de nuevo.';
        } else if (error.code === 'auth/requires-recent-login') {
              mensaje = 'Debes cerrar sesión y volver a iniciar sesión para realizar este cambio por seguridad.';
        } else {
              console.error("Error al cambiar contraseña:", error.code, error.message);
        }

        Swal.fire(
          'Error',
          mensaje,
          'error'
        );
      }
    }
  },
};
</script>

<style scoped>
/* ====== CONTENEDOR GENERAL ====== */
.container-perfil {
  max-width: 600px;
  margin: 10px auto;
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
.secciones-datos {
  margin-bottom: 30px;
}

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

.seccion.configuracion .subtitulo {
  margin-bottom: 10px; /* Pequeño ajuste visual */
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
  flex-grow: 1; /* Permite que el texto ocupe el espacio */
  padding-right: 10px;
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
  color: #515a5a;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  padding: 5px;
}

.editar-pass:hover {
  color: #444;
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

/* ====== BOTONES ACCIÓN ====== */
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
  transition: background 0.3s ease, opacity 0.3s;
}

.btn-logout:hover:not(:disabled) {
  background: #c0392b;
}

.btn-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-eliminar-cuenta {
  width: 100%;
  background: #ffffff;
  color: #e74c3c;
  padding: 12px;
  border: 2px solid #e74c3c;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  margin-top: 15px;
  transition: background-color 0.3s ease, opacity 0.3s;
}

.btn-eliminar-cuenta:hover:not(:disabled) {
  background: #fdf5f5;
}

.btn-eliminar-cuenta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ====== ESTILOS DEL TOGGLE (SWITCH) ====== */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
  flex-shrink: 0; /* Evita que el switch se encoja */
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
  border-radius: 28px;
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
  border-radius: 50%;
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

/* Estilos de SweetAlert2 */
.btn-alerta-principal {
  background-color: #28a5a7 !important;
  border: 1px solid #28a5a7 !important;
  color: white !important;
  box-shadow: none !important;
}

.btn-alerta-principal:hover {
  background-color: #2ec8c8 !important;
}

.btn-alerta-principal-eliminar {
  background-color: #e74c3c !important;
  border: 1px solid #e74c3c !important;
  color: white !important;
  box-shadow: none !important;
}
.btn-alerta-principal-eliminar:hover {
  background-color: #c0392b !important;
}

.btn-alerta-secundaria {
  background-color: #fff !important;
  border: 1px solid #ccc !important;
  color: #444 !important;
  box-shadow: none !important;
}

.btn-alerta-secundaria:hover {
  background-color: #f0f0f0 !important;
}
</style>