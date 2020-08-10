import { EtapaService } from '../services/etapa.service';
import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatSort} from '@angular/material/sort';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { TipoTransfo} from '../models/tipoTransfo';
import { ProtractorBrowser, promise } from 'protractor';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { Etapa } from '../models/etapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import {TipoEtapa} from '../models/tipoEtapa';
import { async } from '@angular/core/testing';
import { isRegExp } from 'util';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EtapaTransfo } from '../models/etapaTransfo';
import {MatTooltipModule} from '@angular/material/tooltip';  
import { AutofillMonitor } from '@angular/cdk/text-field';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Address } from 'cluster';
import { VistaService } from '../services/vista.service';
import { Vista } from '../models/Vista';
import { ViewService } from '../services/view.service';
import { View } from '../models/View';
import { TipoTransfoService } from '../services/tipoTransfo';
import {SelectionModel} from '@angular/cdk/collections';
import {MatExpansionModule} from '@angular/material/expansion';
import { EtapaTransfoConIds } from '../models/etapaTransfoConIds';



interface ComboClientes{
  id:number;
  value:string;
  viewValue:string;
}

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
  selector: 'app-modificar-procesos',
  templateUrl: './modificar-procesos.component.html',
  styleUrls: ['./modificar-procesos.component.css']
})
export class ModificarProcesosComponent implements OnInit {

  isLoadingResults = true;
  isSelected=false;
  // data:Transformadores[]=[];
  dataTransfo:Transformadores;
  dataCli:Cliente[]=[];
  comboCli:ComboClientes[];
  dataTipoEtapa:TipoEtapa[]=[];
  dataEtapa:Etapa[]=[];
  dataEtapaTransfo:EtapaTransfoConIds[]=[];
  displayedColumns:string[]=['select','oP','oT','Observaciones','rango','Cliente','Potencia']
  displayedColumnsEtapaTransfo:string[]=['Accion','NombreProceso','FechaInicio','FechaFin','TiempoParcial','TiempoFin']
  data:MatTableDataSource<Transformadores>;
  durationInSeconds=3;
  mensajeSnack:string;

  //Paginator y Sort
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private transformadoresService: TransformadoresService, private clientesService: ClienteService, private authService: AuthService, private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private getVistaService:VistaService, private tipoTransfoService: TipoTransfoService, private viewService: ViewService) { }

  ngOnInit(): void {
    this.getTransformadores();
    
  }

  selection = new SelectionModel<Transformadores>(true, []);

  checkboxLabel(row?: Transformadores): string {
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idTransfo + 1}`;
  }

  getTransformadores(): void {
    this.transformadoresService.getTrafos()
      .subscribe(transfo => {
        this.data=new MatTableDataSource();
        this.data.data = transfo;
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        console.log(this.data.data);
        this.isLoadingResults = false;
      }, err => {
        // console.log(err);
        this.isLoadingResults = false;
      });
      
  }
  getClientes(): void {
    this.clientesService.getClientes()
    .subscribe(cliente => {
      // console.log("clientes",cliente);
      this.dataCli=cliente;
      this.comboCli =(<any[]>cliente).map(v => {
        return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
      })
    });
  };

  getTipoEtapas(): Observable<any> {
    return this.tipoEtapaService.getTipoEtapas().pipe(
      tap(tipoEtapa => this.dataTipoEtapa = tipoEtapa)
    )
  }

  getEtapasporTransfo(id:number): Observable<Etapa[]> {
    return this.etapaService.getEtapasPorIdTransfo(id).pipe(
      tap(etapa => this.dataEtapa = etapa)
    );
  }

  updateEtapa(idEtapa,etapa) {
    
    this.isLoadingResults = true;
    this.etapaService.updateEtapa(idEtapa,etapa).subscribe(
      res => {
        this.isLoadingResults = false;

        this.openSnackBar("Proceso modificado");
      },
      err => {
        this.openSnackBar(err);
        // console.log(err);
        this.isLoadingResults = false;
      }
    );
    
  }

  
  onRowClick(row){
    this.isSelected=true;
    this.dataTransfo=row;
    console.log(this.dataTransfo);
    forkJoin([
      this.getEtapasporTransfo(this.dataTransfo.idTransfo),
      this.getTipoEtapas()
    ]).subscribe(() => {
      this.asignarEtapaTransfo(this.dataTransfo);
    });
  }

  asignarEtapaTransfo(transfo){
    this.dataEtapaTransfo=[];
    transfo.etapa.forEach((f,j)=>{
        let obj = new EtapaTransfoConIds;     
        let nombreEtapa=this.dataTipoEtapa.find(x=>x.idTipoEtapa==f.idTipoEtapa);
        obj.nombreEtapa=nombreEtapa.nombreEtapa;
        obj.idTransfo=f.idTransfo;
        obj.idTipoEtapa=f.idTipoEtapa;
        obj.idEtapa=f.idEtapa;
        obj.dateIni=f.dateIni;
        obj.dateFin=f.dateFin;
        obj.tiempoParc=f.tiempoParc;
        obj.tiempoFin=f.tiempoFin;   
        this.dataEtapaTransfo.push(obj);
      })
      console.log(this.dataEtapaTransfo);
    }


    onProcessClick(row){
      // console.log(row.idEtapa);
      // console.log(this.dataEtapa);
      let etapaSeleccionada:Etapa=this.dataEtapa.find(x=>x.idEtapa==row.idEtapa);
      // console.log(etapaSeleccionada);
      this.openDialogModifyProcess(etapaSeleccionada);
    }

    openDialogModifyProcess(etapa:Etapa):void{
      
      
      const dialogModifyProcess = this.dialog.open(ReAsignarProcesoComponent, { 
        width:'90%',
        data:{
          titulo:"Reasignar Proceso",
          labelButton:"Guardar Cambios",
          update:false,
          et:etapa
        }
      });
      
      dialogModifyProcess.beforeClosed().subscribe(res=>{
        if(res){
          // let etapaViejaTransfoNuevo=res.etapa.find(x=>x.idTipoEtapa==etapa.idTipoEtapa)
          // etapaViejaTransfoNuevo.idTransfo=
          // console.log("Etapa SELECCIONADA TRANSFO VIEJO: ",etapa);
          // // console.log("ETAPA VIEJA TRANSFO NUEVO: ",etapaViejaTransfoNuevo);
          
          // etapaViejaTransfoNuevo.idTransfo=etapa.idTransfo;
          // // etapa.idTransfo=res.idTransfo;
          
          // console.log("Etapa SELECCIONADA TRANSFO NUEVO: ",etapa);
          // // console.log("ETAPA VIEJA TRANSFO NUEVO CAMBIADA AL TRANSFO DE OBJ: ",etapaViejaTransfoNuevo);
            
          // // this.updateEtapa(obj.idEtapa,obj);
          // // this.updateEtapa(res.idEtapa,res);
            let etapaSel=etapa;
          
            this.assignEtapaDelTrafoNuevo(res,etapaSel)
          
            this.assignEtapaAlTrafoNuevo(res,etapaSel)
          

        }
      })
    }

    assignEtapaDelTrafoNuevo(res:any,etapaSel:Etapa){
      
      let etapaViejaTransfoNuevo=res.etapa.find(x=>x.idTipoEtapa==etapaSel.idTipoEtapa);
      etapaViejaTransfoNuevo.idTransfo=etapaSel.idTransfo;
      this.updateEtapa(etapaViejaTransfoNuevo.idEtapa,etapaViejaTransfoNuevo);
    }

    assignEtapaAlTrafoNuevo(res:any,etapa:Etapa){
      etapa.idTransfo=res.idTransfo;
      this.updateEtapa(etapa.idEtapa,etapa);
    }


    openSnackBar(mensaje) {
      this._snackBar.open(mensaje,"mensaje", {
         duration: this.durationInSeconds * 1000,
        });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;      
      this.data.filter = filterValue.trim().toLowerCase();
      if (this.data.paginator) {
        this.data.paginator.firstPage();
      }
    }


}


@Component({
  selector: "asignar-procesos",
  templateUrl: "asignar-procesos.html"
})
export class ReAsignarProcesoComponent{
  isLoadingResults:boolean;
  titulo:string;
  data:MatTableDataSource<Transformadores>;
  etapa:Etapa=null;
  response:Object;
  displayedColumns:string[]=['select','oP','oT','Observaciones','rango','Cliente','Potencia']
  constructor(private transformadoresService:TransformadoresService,public dialog: MatDialog,private dialogRef: MatDialogRef<ReAsignarProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) data1){
      this.titulo=data1.titulo;
      this.etapa=data1.et;
    };
    ngOnInit(){
      console.log(this.etapa)
      this.getTransformadores();
    };

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  getTransformadores(): void {
  this.transformadoresService.getTransformadores()
  .subscribe(transfo => {
    this.data=new MatTableDataSource();
    this.data.data = transfo;
    this.data.paginator = this.paginator;
    this.data.sort = this.sort;
    console.log(this.data);
    this.isLoadingResults = false;
    }, err => {
    this.isLoadingResults = false;
    });
  }

  onRowClick(row){
    let trafoElegido=this.data.data.find(x=>x.idTransfo==row.idTransfo)
    this.openDialogConfirmModifyProcess(trafoElegido);
  }

  openDialogConfirmModifyProcess(trafo):void{
    
    const dialogConfirmModifyProcess = this.dialog.open(ReAsignarProcesoConfirmComponent, { 
      width:'50%',
      data:{
        titulo:"Confirmar Reasignación de Proceso",
        update:false,
        trafo:trafo    
      }
    });
    dialogConfirmModifyProcess.afterClosed().subscribe(res =>{
      
      console.log("RES",res);
      this.dialogRef.close(res);
      this.dialog.closeAll();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;      
    this.data.filter = filterValue.trim().toLowerCase();
    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "asignar-procesos-confirm",
  templateUrl: "asignar-procesos-confirm.html"
})
export class ReAsignarProcesoConfirmComponent{
  isLoadingResults:boolean;
  titulo:string;
  update:boolean;
  data:any;
  constructor(private dialogRef: MatDialogRef<ReAsignarProcesoConfirmComponent>,@Inject(MAT_DIALOG_DATA) data1){
    this.titulo=data1.titulo;
    this.data=data1.trafo;
    this.update=data1.update;
  }
  ngOnInit(){console.log(this.data)}
  
  click(){
    this.data.update=true;
    this.dialogRef.close(this.data);
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

