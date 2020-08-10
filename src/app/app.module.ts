import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./interceptors/token.interceptors";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
  import { MatInputModule } from '@angular/material/input'; 
  import { MatTooltipModule } from '@angular/material/tooltip';
  import {MatSnackBarModule} from '@angular/material/snack-bar';
  import {MatSelectModule} from '@angular/material/select';
  import {MatToolbarModule} from '@angular/material/toolbar';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { EmpleadosComponent,CourseDialogComponent} from './empleados/empleados.component';
  import { NavBarComponent } from './nav-bar/nav-bar.component';
  import {MatSidenavModule} from '@angular/material/sidenav';
  import {MatDialogModule} from '@angular/material/dialog';
  import {MatGridListModule} from '@angular/material/grid-list';
  
  import {CourseDialog2Component,CourseDialog4Component, ShowInfoComponent, AssignColorComponent,ConfirmAssignDialog} from './transformadores-reloaded/transformadores-reloaded.component'
import { ClientesComponent,CourseDialog3Component } from './clientes/clientes.component';

import {DialogFinalizarProceso} from './reloj/reloj.component';
import * as $ from "../../node_modules/jquery/dist/jquery.min.js";
import * as moment from 'moment';

import { ModificarProcesosComponent } from './modificar-procesos/modificar-procesos.component';
import {ReAsignarProcesoComponent} from './modificar-procesos/modificar-procesos.component';
import {ReAsignarProcesoConfirmComponent} from './modificar-procesos/modificar-procesos.component';
import { getSpanishPaginatorIntl } from './spanish-paginator-int';
import {MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { OrderComponent, AltaAnioMes } from './order/order.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { LeyendasComponent } from './leyendas/leyendas.component';
import { ReferenciasComponent, DialogReferenciasDialog } from './referencias/referencias.component';
import { TransformadoresReloadedComponent, EtapaColumnComponent } from './transformadores-reloaded/transformadores-reloaded.component';
import { MensajesService } from './services/mensajes.service';
import { TimerReloadedComponent, EtapaColumnComponent2 } from './timer-reloaded/timer-reloaded.component';
import { RelojComponent } from './reloj/reloj.component';
import { MatChipsModule } from '@angular/material/chips';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {GuardianGuard} from './guardian.guard';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { OrderReloadedComponent } from './order-reloaded/order-reloaded.component';
import { NewOrderComponent, AltaAnioMesReloaded } from './new-order/new-order.component';
import { EmployerReportComponent } from './employer-report/employer-report.component';
import {MatMenuModule} from '@angular/material/menu';

  @NgModule({
    declarations: [AppComponent, EtapaColumnComponent,EtapaColumnComponent2, LoginComponent, RegisterComponent,  EmpleadosComponent, NavBarComponent,CourseDialogComponent,DialogFinalizarProceso,CourseDialog2Component, ClientesComponent,CourseDialog3Component,CourseDialog4Component,ShowInfoComponent, ModificarProcesosComponent,ReAsignarProcesoComponent,ReAsignarProcesoConfirmComponent, OrderComponent,AltaAnioMes,AltaAnioMesReloaded, LeyendasComponent, ReferenciasComponent,DialogReferenciasDialog, TransformadoresReloadedComponent,AssignColorComponent,ConfirmAssignDialog, TimerReloadedComponent, RelojComponent, DailyReportComponent, OrderReloadedComponent, NewOrderComponent, EmployerReportComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule,MatInputModule,DragDropModule,
      MatPaginatorModule,MatProgressSpinnerModule, MatSortModule, MatTableModule, MatIconModule, MatButtonModule, MatCardModule,
      MatFormFieldModule,MatAutocompleteModule,MatMenuModule, MatDatepickerModule, MatNativeDateModule,FormsModule, ReactiveFormsModule, MatToolbarModule,MatSidenavModule,MatListModule,MatSelectModule,MatChipsModule,MatDialogModule,MatGridListModule,MatSnackBarModule,MatTooltipModule,ColorPickerModule,SatDatepickerModule, SatNativeDateModule],
      providers: [
        { provide: GuardianGuard},
        { provide: MensajesService},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
        {provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
      ],
  entryComponents:[CourseDialogComponent,DialogFinalizarProceso,EmpleadosComponent,CourseDialog2Component,CourseDialog3Component,ClientesComponent,CourseDialog4Component,ShowInfoComponent,ReAsignarProcesoComponent,ReAsignarProcesoConfirmComponent,AltaAnioMes,AltaAnioMesReloaded,DialogReferenciasDialog,AssignColorComponent,ConfirmAssignDialog],
  bootstrap: [AppComponent]
})
export class AppModule {}
