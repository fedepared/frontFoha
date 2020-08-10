import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EtapaEmpleadoService } from '../services/etapaEmpleado.service';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado';
import { EtapaEmpleado } from '../models/etapaEmpleado';

@Component({
  selector: 'app-employer-report',
  templateUrl: './employer-report.component.html',
  styleUrls: ['./employer-report.component.css']
})
export class EmployerReportComponent implements OnInit {
  dataEmpleados:Empleado[]=[];
  dataEtapaEmpleado:EtapaEmpleado[]=[];
  empleadosControl = new FormControl();
  filteredOptions: Observable<Empleado[]>;
  constructor(private etapaEmpleadoService:EtapaEmpleadoService,private empleadoService:EmpleadoService) { }

  ngOnInit(): void {
    this.getEmpleados();
    this.filteredOptions = this.empleadosControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.dataEmpleados.slice())
      );
  }

  getEtapaEmpleado(id: string) {
    this.etapaEmpleadoService.getEtapaEmpleado(id).subscribe(data => {
      this.dataEtapaEmpleado=data;
      console.log(this.dataEtapaEmpleado);

    });
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      empleados => {
        this.dataEmpleados = empleados;
        //console.log(this.dataEmpleados);
        // console.log(this.data);
        // this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        // this.isLoadingResults = false;
      }
    );
  }

  search(){
    console.log(this.empleadosControl.value);
    this.getEtapaEmpleado(this.empleadosControl.value.idEmpleado);

  }

  displayFn(empleado: Empleado): string {
    return empleado && empleado.nombreEmp ? empleado.nombreEmp : '';
  }

  private _filter(name: string): Empleado[] {
    const filterValue = name.toLowerCase();

    return this.dataEmpleados.filter(option => option.nombreEmp.toLowerCase().indexOf(filterValue) === 0);
  }

}
