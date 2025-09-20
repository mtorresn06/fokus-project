import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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