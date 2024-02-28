import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import {InicioSesionComponent} from './pages/inicio-sesion/inicio-sesion.component'
import {RegistroComponent} from './pages/registro/registro.component'

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'inicio_sesion', component: InicioSesionComponent },
    { path: 'registro', component: RegistroComponent }
];
