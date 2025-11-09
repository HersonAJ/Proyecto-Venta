import { Routes } from '@angular/router';
import { Inicio  } from './inicio/inicio';
import { Login } from './login/login';
import { RegistroComponent } from './registro-component/registro-component';

export const routes: Routes = [
    { path: 'inicio', component: Inicio},
    { path: 'login', component: Login},
    { path: 'registro', component: RegistroComponent},
];
