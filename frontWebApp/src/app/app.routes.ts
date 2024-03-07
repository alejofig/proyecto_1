import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import {InicioSesionComponent} from './pages/inicio-sesion/inicio-sesion.component'
import {RegistroComponent} from './pages/registro/registro.component'
import { PanelComponent } from './pages/panel/panel.component';
import { PlanEntrenamientoComponent } from './pages/plan-entrenamiento/plan-entrenamiento.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { ServiciosTercerosComponent } from './pages/servicios-terceros/servicios-terceros.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgregarServicoComponent } from './pages/socios/agregar-servico/agregar-servico.component';
import { EstadoCuentaComponent } from './pages/socios/estado-cuenta/estado-cuenta.component';
import { FormasPagoComponent } from './pages/socios/formas-pago/formas-pago.component';
import { GestionContratosComponent } from './pages/socios/gestion-contratos/gestion-contratos.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },

    { path: 'inicio_sesion', component: InicioSesionComponent },
    { path: 'registro', component: RegistroComponent },

    { path: 'panel', component: PanelComponent},
    
    { path: 'plan_entrenamiento', component: PlanEntrenamientoComponent},
    { path: 'eventos', component: EventosComponent},
    { path: 'servicios_terceros', component: ServiciosTercerosComponent},
    { path: 'dashboard', component: DashboardComponent},

    { path: 'socios', component: EstadoCuentaComponent},
    { path: 'socios/agregar_servicios', component: AgregarServicoComponent},
    { path: 'socios/formas_pago', component: FormasPagoComponent},
    { path: 'socios/gestion_contratos', component: GestionContratosComponent},


];
