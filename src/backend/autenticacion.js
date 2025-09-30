import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// Registrar
export const registrarUsuario = async (correo, clave) => {
  return await createUserWithEmailAndPassword(auth, correo, clave);
};

// Iniciar sesión
export const iniciarSesion = async (correo, clave) => {
  return await signInWithEmailAndPassword(auth, correo, clave);
};

// Cerrar sesión
export const cerrarSesion = async () => {
  return await signOut(auth);
};

export const cambiarContrasena = async (usuario, contrasenaActual, nuevaContrasena) => {
  // 1. Crear una credencial con la contraseña actual
  const credencial = EmailAuthProvider.credential(
    usuario.email,
    contrasenaActual
  );

  // 2. Reautenticar al usuario
  await reauthenticateWithCredential(usuario, credencial);

  // 3. Actualizar la contraseña
  return await updatePassword(usuario, nuevaContrasena);
};