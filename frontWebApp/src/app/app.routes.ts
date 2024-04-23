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
import { DeportesComponent } from './pages/admin/deportes/deportes.component';
import { IndicadoresComponent } from './pages/admin/indicadores/indicadores.component';
import { GenerarPlanEntreComponent } from './pages/generar-plan-entre/generar-plan-entre.component';
import { MototallerComponent } from './pages/servicios/mototaller/mototaller.component';
import { PrimerosAuxiliosComponent } from './pages/servicios/primeros-auxilios/primeros-auxilios.component';
import { EntrenadorComponent } from './pages/servicios/entrenador/entrenador.component';
import {AlimentacionComponent} from './pages/servicios/alimentacion/alimentacion.component'
import { AuthButtonComponent } from './pages/auth-button/auth-button.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'auth0', component: AuthButtonComponent},
    { path: 'inicio_sesion', component: InicioSesionComponent },
    { path: 'registro', component: RegistroComponent },

    { path: 'panel', component: PanelComponent,canActivate: [AuthGuard] },

    {path: 'generar_plan_entrenamiento', component: GenerarPlanEntreComponent},
    { path: 'plan_entrenamiento', component: GenerarPlanEntreComponent},
    { path: 'eventos', component: EventosComponent},
    { path: 'servicios_terceros', component: ServiciosTercerosComponent},
    { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard]},

    {path: 'servicios/mototaller', component: MototallerComponent},
    {path: 'servicios/alimentacion', component: AlimentacionComponent},
    {path: 'servicios/entrenador', component: EntrenadorComponent},

    { path: 'socios', component: EstadoCuentaComponent},
    { path: 'socios/agregar_servicios', component: AgregarServicoComponent},
    { path: 'socios/formas_pago', component: FormasPagoComponent},
    { path: 'socios/gestion_contratos', component: GestionContratosComponent},

    {path: 'admin', component: DeportesComponent},
    {path: 'admin/indicadores', component: IndicadoresComponent},
];
