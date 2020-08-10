import { Component, OnInit, ViewChild, Input, Output,EventEmitter, NgZone } from '@angular/core';
import { TransformadoresService } from '../services/transformadores.service';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { Transformadores } from '../models/transformadores';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Etapa } from '../models/etapa';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado';
import { EtapaService } from '../services/etapa.service';
import { take } from 'rxjs/operators';


const MAP_NOMBRE_ETAPA: { [tipoEtapa: string]: number} = {
  "documentacion":1,
  "bobinaBT1":2,
  "bobinaBT2":3,
  "bobinaBT3":4,
  "bobinaAT1":5,
  "bobinaAT2":6,
  "bobinaAT3":7,
  "bobinaRG1":8,
  "bobinaRG2":9,
  "bobinaRG3":10,
  "bobinaRF1":11,
  "bobinaRF2":12,
  "bobinaRF3":13,
  "ensamblajeBobinas":14,
  "corteYPlegadoPYS":15,
  "soldaduraPYS":16,
  "envioPYS":17,
  "nucleo":18,
  "montaje":19,
  "horno":20,
  "cYPTapaCuba":21,
  "tapa":22,
  "radiadoresOPaneles":23,
  "cuba":24,
  "tintasPenetrantes":25,
  "granallado":26,
  "pintura":27,
  "encubado":28,
  "ensayosRef":29,
  "terminacion":30,
  "envioADeposito":31,
  "envioACliente":32
}



@Component({
  selector: 'etapa-column-component2',
  template: `
  <ng-container *ngIf="etapa">
    <div style="height:61px; line-height:61px" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' ">
      <span *ngIf="etapa.dateIni">{{etapa.numEtapa}}</span>
      <!--
      <span style="padding-left:30px;" *ngIf="etapa.dateFin" (click)=select(etapa) >{{etapa.numEtapa}}</span>
      <span style="padding-left:30px;" *ngIf="(etapa.tiempoParc)!='Finalizada' && (etapa.tiempoParc)!=null" (click)=select(etapa) >{{etapa.numEtapa}}
      </span>
      -->
      <button mat-icon-button style="float:right;" *ngIf="!etapa.dateIni" (click)=select(etapa)><mat-icon>done</mat-icon></button>
      
    </div>
  </ng-container>
  `,
  styleUrls: ['./timer-reloaded.component.css']
})
export class EtapaColumnComponent2{
  @Input() etapa:Etapa;
  @Output() procesoSelected=new EventEmitter<Etapa>();
  
  select(row){
    
    this.procesoSelected.emit(row);

  }
}


@Component({
  selector: 'app-timer-reloaded',
  templateUrl: './timer-reloaded.component.html',
  styleUrls: ['./timer-reloaded.component.css']
})
export class TimerReloadedComponent implements OnInit {

  dataGetTrafos:MatTableDataSource<any>;
  isLoadingResults=true;
  trafosResponse:Transformadores[]=[];
  
  
  // displayedColumns1:string[]=['Accion']
  displayedColumns2:string[]=[
    'oTe',
    'oPe',
    'rangoInicio',
    'rangoFin',
    'observaciones',
    'potencia',
    'nombreCli',
  ]
  dataTrafo:Transformadores;
  //esto es una forma cheta de obtener el array con los nombres de
  //las columnas que machean con el "nombreTipoEtapa".
  etapasColumns: string[]= Object.keys(MAP_NOMBRE_ETAPA);
  data4:Etapa[]=[];
  // TODAS las columnas
  allColumns: string[]= this.displayedColumns2.concat(this.etapasColumns);
  dataSource;
  etapasActualizadas:boolean;
  numRef:number=0;
  durationInSeconds=3;
  procesoElegido:Object;
  selectedProceso=false;
  timers : string[] = []
  contador=0;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, { static: false }) matTable: MatTable<any>;
  constructor(private ngZone: NgZone,private etapaService:EtapaService,private empleadoService:EmpleadoService,private transformadoresService:TransformadoresService,private route: ActivatedRoute,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getTrafos();
    
  }

  ngAfterViewInit() {
    this.ngZone.onMicrotaskEmpty.pipe(take(5)).subscribe(() => this.matTable.updateStickyColumnStyles());
  }

  getTrafos():void{
    this.transformadoresService.getTrafos()
    .subscribe(transfo => {
      if(transfo.length>0){

      
      console.log(transfo);
      let mes=this.asignarMes(transfo[0].mes)
      let obj={group:`${mes} de ${transfo[0].anio} `}
      let ultimoAnio=transfo[0].anio;
      let ultimoMes=mes;
      this.dataGetTrafos=new MatTableDataSource();
      this.dataGetTrafos.data.push(obj);
      this.trafosResponse = transfo;
      this.trafosResponse.forEach((e)=>{
        mes=this.asignarMes(e.mes);
        if(e.anio!=ultimoAnio)
        {
          obj={group:`${mes} de ${e.anio} `};
          this.dataGetTrafos.data.push(obj);
          this.dataGetTrafos.data.push(e);
          
          
        }
        else{
          if(mes!=ultimoMes)
          {
            obj={group:`${mes} de ${e.anio} `}
            this.dataGetTrafos.data.push(obj);
          }
          this.dataGetTrafos.data.push(e);
        }
        
        ultimoAnio=e.anio;
        ultimoMes=mes;
      })
      // console.log("array 2: ", this.dataGetTrafos.data);
      // console.log("Trafo Response", this.trafosResponse);
      this.dataGetTrafos.sort = this.sort;
      
      // let resultado = this.dataGetTrafos[1].etapa.filter(x=>x.idTipoEtapa==1)
      // console.log(resultado);
      
    }
    this.isLoadingResults = false;
    }, err => {
      // console.log(err);
      this.isLoadingResults = false;
    });
  }

  moveUp(){
    console.log(window.top)
    window.scrollTo(0,0);
  }

  //Obtiene la etapa de un transformador en base al nombre de la etapa
  getEtapa(t:Transformadores, nombreEtapa: string): any {
    let matchEtapa = t.etapa.filter(etapa => etapa.idTipoEtapa == MAP_NOMBRE_ETAPA[nombreEtapa]);
    if(matchEtapa.length!=0)
    {
      return matchEtapa[0];
    }
    if(this.etapasActualizadas==true)
    {
      this.getTrafos();
    }
  }

  selected(evento){
    
    
    this.openSnackBar("Proceso seleccionado!")
    this.selectedProceso=true;
    this.procesoElegido=evento;
    console.log(this.procesoElegido);
      this.contador++;
      this.timers.push('Timer' + this.contador) 
    
  // 
  // agregar() { 
  // } 

  }

  asignarMes(int:number):string{
    switch(int){
      case 1:
        return 'Enero';
        break;
      case 2:
        return 'Febrero';
        break;
      case 3:
        return 'Marzo';
        break;
      case 4:
        return 'Abril';
        break;
      case 5:
        return 'Mayo';
        break;
      case 6:
        return 'Junio';
        break;
      case 7:
        return 'Julio';
        break;
      case 8:
        return 'Agosto';
        break;
      case 9:
        return 'Septiembre';
        break;
      case 10:
        return 'Octubre';
        break;
      case 11:
        return 'Noviembre';
        break;
      case 12:
        return 'Diciembre';
        break;
    }
  }

  numeroEtapa(row){
    console.log(row);
  }

  
  procesoUpdated(evento){
    if(evento==true)
    {
      this.getTrafos();
    }
  }

  
  

  isGroup(index, item): boolean{
    return item.group;
  }

  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: this.durationInSeconds * 1000,
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;      
    this.dataGetTrafos.filter = filterValue.trim().toLowerCase();
    if (this.dataGetTrafos.paginator) {
      this.dataGetTrafos.paginator.firstPage();
    }
  }

}
