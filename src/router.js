import { createRouter, createWebHistory } from "vue-router";
import InicioGUI from "./pantallas/Inicio/InicioGUI.vue";
import LoginGUI from "./pantallas/Login/LoginGUI.vue";
import RegistroGUI from "./pantallas/Registro/RegistroGUI.vue";
import RegistradorGUI from "./pantallas/Home/RegistradorGUI.vue";

const routes = [
  { path: "/", component: InicioGUI },
  { path: "/login", component: LoginGUI },
  { path: "/registro", component: RegistroGUI },
  { path: "/registrador", component: RegistradorGUI },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;