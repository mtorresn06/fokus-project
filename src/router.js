import { createRouter, createWebHistory } from "vue-router";
import InicioGUI from "./pantallas/Inicio/InicioGUI.vue";
import LoginGUI from "./pantallas/Login/LoginGUI.vue";
import RegistroGUI from "./pantallas/Registro/RegistroGUI.vue";
import Home from "./pantallas/Home/Home.vue";
import Edicion from "./pantallas/Edicion/Edicion.vue";

const routes = [
  { path: "/", component: InicioGUI },
  { path: "/login", component: LoginGUI },
  { path: "/registro", component: RegistroGUI },
  { path: "/home", component: Home },
  {
    path: "/tarea/nueva",
    name: "NuevaTarea",
    component: Edicion,
  },
  {
    path: "/tarea/editar/:id",
    name: "EditarTarea",
    component: Edicion,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;