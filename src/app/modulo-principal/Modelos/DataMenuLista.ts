import MenuLista from "./MenuList";

export const DataMenuLista: MenuLista[] =
[
  {
    nombre: "Inicio",
    icon:"home",
    default: true,
    ruta: "ventas/inicio",
    permisos: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    nombre: "Inventario",
    icon:"inventory",
    default: true,
    ruta: "inventario/crear",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Gastos",
    icon:"pending_actions",
    default: true,
    ruta: "ventas/inicio",
    permisos: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    nombre: "Control",
    icon:"trending_up",
    default: true,
    ruta: "ventas/inicio",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Usuarios",
    icon:"person_add",
    default: true,
    ruta: "ventas/inicio",
    permisos: ["ROLE_ADMIN"]

  },
  {
    nombre: "Cerrar sesion",
    icon:"exit_to_app",
    default: true,
    ruta: "ventas/inicio",
    permisos: ["ROLE_ADMIN","ROLE_EMP"]

  }
]
