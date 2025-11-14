import { Routes } from '@angular/router';
import { Inicio  } from './inicio/inicio';
import { Login } from './login/login';
import { RegistroComponent } from './registro-component/registro-component';
import { PerfilComponent } from './perfil-component/perfil-component';
import { CrearProductoComponent } from './crear-producto-component/crear-producto-component';
import { MenuComponent } from './menu-component/menu-component';
import { PersonalizarPedidoComponent } from './personalizar-pedido-component/personalizar-pedido-component';
import { CarritoComponent } from './carrito-component/carrito-component';

export const routes: Routes = [
    { path: 'inicio', component: Inicio},
    { path: 'login', component: Login},
    { path: 'registro', component: RegistroComponent},
    { path: 'perfil', component: PerfilComponent},
    { path: 'crear-producto', component: CrearProductoComponent},
    { path: 'menu', component: MenuComponent},
    { path: 'personalizar/:id', component: PersonalizarPedidoComponent},
    { path: 'carrito', component: CarritoComponent},
];
