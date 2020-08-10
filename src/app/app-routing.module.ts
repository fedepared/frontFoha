import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { EmpleadosComponent } from './empleados/empleados.component';
import { ClientesComponent } from './clientes/clientes.component';

import { ModificarProcesosComponent } from './modificar-procesos/modificar-procesos.component';
import { OrderComponent } from './order/order.component';

import { ReferenciasComponent } from './referencias/referencias.component';
import { TransformadoresReloadedComponent } from './transformadores-reloaded/transformadores-reloaded.component';
import { TimerReloadedComponent } from './timer-reloaded/timer-reloaded.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { GuardianGuard } from './guardian.guard';
import { OrderReloadedComponent } from './order-reloaded/order-reloaded.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { EmployerReportComponent } from './employer-report/employer-report.component';

const routes: Routes = [
  {path:'login',component:LoginComponent,data:{title:'Login'}},
  {path:'register',component:RegisterComponent,data:{title:'Registro'}},
  {path:'',component:LoginComponent},
  {path:'reportes',component:DailyReportComponent,canActivate:[GuardianGuard]},
  {path: 'empleados', component:EmpleadosComponent,canActivate:[GuardianGuard]},
  {path: 'clientes',component:ClientesComponent,canActivate:[GuardianGuard] },
  {path:'procesos',component:TimerReloadedComponent,canActivate:[GuardianGuard]},
  {path:'modificarProcesos',component:ModificarProcesosComponent,canActivate:[GuardianGuard]},
  /*{path:'order',component:OrderComponent,canActivate:[GuardianGuard]},*/
  {path:'referencias',component:ReferenciasComponent,canActivate:[GuardianGuard]},
  {path:'trafos',component:TransformadoresReloadedComponent,canActivate:[GuardianGuard]},
  {path:'prioridades',component:NewOrderComponent,canActivate:[GuardianGuard]},
  {path:'reporteEmpleados',component:EmployerReportComponent,canActivate:[GuardianGuard]}
  //{path:'**',redirectTo:'/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
