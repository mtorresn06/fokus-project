import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Colección de tareas dentro de cada usuario
const tareasCollection = (uid) => collection(db, "usuarios", uid, "tareas");

// Crear
export const crearTarea = async (uid, tarea) => {
  const nuevaTarea = {
    titulo: tarea.titulo,
    descripcion: tarea.descripcion || "",
    estado: tarea.estado || "Pendiente",
    fechaLimite: tarea.fechaLimite || "", 
    importancia: tarea.importancia || "baja", 
    creadoEn: new Date(),
  };

  return await addDoc(tareasCollection(uid), nuevaTarea);
};

// Leer
export const obtenerTareas = async (uid) => {
  const snapshot = await getDocs(tareasCollection(uid));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Actualizar
export const editarTarea = async (uid, id, nuevaData) => {
  const ref = doc(db, "usuarios", uid, "tareas", id);

  const actualizada = {
    titulo: nuevaData.titulo,
    descripcion: nuevaData.descripcion || "",
    estado: nuevaData.estado || "Pendiente",
    fechaLimite: nuevaData.fechaLimite || "",
    importancia: nuevaData.importancia || "baja",
  };

  return await updateDoc(ref, actualizada);
};

// Eliminar
export const borrarTarea = async (uid, id) => {
  const ref = doc(db, "usuarios", uid, "tareas", id);
  return await deleteDoc(ref);
};