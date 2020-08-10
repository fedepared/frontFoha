import { Component, OnInit, Inject,ViewChild, Input, Output,EventEmitter, OnChanges, SimpleChanges, SimpleChange, NgZone } from '@angular/core';
import { Transformadores } from '../models/transformadores';
import { TransformadoresService } from '../services/transformadores.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { EtapaService } from '../services/etapa.service';
import { Etapa } from '../models/etapa';
import { TipoEtapaService } from '../services/tipo-etapa.service';
import {TipoEtapa} from '../models/tipoEtapa';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { TransformadoresEtapas } from '../models/transformadoresEtapas';
import { VistaService } from '../services/vista.service';
import { Vista } from '../models/Vista';
import { ViewService } from '../services/view.service';
import { TipoTransfoService } from '../services/tipoTransfo';
import { ExcelService } from '../services/excel.service';
import {MensajesService} from '../services/mensajes.service';
import { LeyendasComponent } from '../leyendas/leyendas.component';
import { Colores } from '../models/colores';
import { ColoresService } from '../services/colores.service';
import { Color } from 'exceljs';
import { EtapaTransfo } from '../models/etapaTransfo';

//filtro
import {map, startWith} from 'rxjs/operators';
import * as jQuery from 'jquery';

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
  selector: 'etapa-column-component',
  template: `
  <ng-container *ngIf="etapa">
    <div style="height:64px;line-height:64px" [style.background-color] = "etapa.idColorNavigation ? etapa.idColorNavigation.codigoColor : 'white'" [matTooltip]="etapa.idColorNavigation ? etapa.idColorNavigation.leyenda : '' ">
      <span style="padding-left:10px;" *ngIf="etapa.dateFin" >{{etapa.dateFin | date:'MM/dd/yyyy'}}</span>
      <span style="padding-left:10px;" *ngIf="(etapa.tiempoParc)!='Finalizada' && (etapa.tiempoParc)!=null" >{{etapa.tiempoParc}}</span>
      <span>
        <button mat-icon-button *ngIf="!etapa.dateIni" style="line-height:64px" (click)=asignarRef(etapa) matTooltip="Asignar referencia"><mat-icon>done</mat-icon></button>
      </span>
      <!--<span  ></span>-->
    </div>
  </ng-container>
  `,
  
  styleUrls: ['./transformadores-reloaded.component.css']
})
export class EtapaColumnComponent{
  coloresArr:Colores[]=[];
  etapaSelected:Etapa;
  // _coloresActualizados:boolean;

  @Input() etapa:Etapa; actualizar:Boolean;
  @Output() actualizado=new EventEmitter<Boolean>();
  
  
  
  constructor(private coloresService:ColoresService,public dialog: MatDialog,private transformadoresService:TransformadoresService){}
  
  getColores(): void{
    this.coloresService.getColores()
    .subscribe(colores=>{
      this.coloresArr=colores;
      console.log(this.coloresArr);
      //      this.isLoadingResults=false;
    },err=>{
      console.log(err)
      //this.isLoadingResults=false;
    })
  }
  asignarRef(row){
    
    this.etapaSelected=row;
    console.log(this.etapaSelected);
    const dialogConfig = new MatDialogConfig();
    

    dialogConfig.data = {
        etapaSelected:this.etapaSelected,
        coloresArr:this.coloresArr
    };
    console.log(dialogConfig.data)
    dialogConfig.width= '700px';
    const dialogRef = this.dialog.open(AssignColorComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        console.log(data);
        this.actualizado.emit(true)
      }
      else
      {
        this.actualizado.emit(false);
      }

    })
  }
  
  
}

@Component({
  selector: "asignar-colores",
  templateUrl: "asignar-colores.html"
})
export class AssignColorComponent{
  etapaSelected:Etapa;
  coloresArr:Colores[];
  data:MatTableDataSource<Colores>;
  displayedColumns:string[]=['select','color','leyenda']
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignColorComponent>,private coloresService:ColoresService,public dialog: MatDialog,private etapaService:EtapaService,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.etapaSelected=data1.etapaSelected
      //this.coloresArr=data1.coloresArr
  }

  ngOnInit(){
    this.getColores();
    //this.comenzar();
  }

  getColores():void{
    this.coloresService.getColores()
    .subscribe(colores=>{
      this.coloresArr=colores;
      console.log(this.coloresArr);
      this.data=new MatTableDataSource();
      this.data.data = this.coloresArr;
      this.data.sort = this.sort;
      console.log(this.data.data);
    },err=>{
      console.log(err)
      //this.isLoadingResults=false;
    })
  }

  onRowClick(row){
    console.log(row);
    const dialogConfig = new MatDialogConfig();


    dialogConfig.data = {
        colorSelected:row
    };
    console.log(dialogConfig.data)
    dialogConfig.width= '400px';
    const dialogRef = this.dialog.open(ConfirmAssignDialog, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.etapaSelected.idColor=data.idColor;
        this.etapaService.updateEtapa(this.etapaSelected.idEtapa,this.etapaSelected)
        .subscribe(res=>{
            console.log(res)
            this.dialogRef.close(res);
            
      //      this.isLoadingResults=false;
          },err=>{
            console.log(err)
      //this.isLoadingResults=false;
        })
      }
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

@Component({
  selector: "confirm-assign.html",
  templateUrl: "confirm-assign.html"
})
export class ConfirmAssignDialog{
  colorSelected:Colores;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmAssignDialog>,private coloresService:ColoresService,public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data1
  ) {
      this.colorSelected=data1.colorSelected


    } 

    save(){
      // console.log(this.colorSelected);  
      this.dialogRef.close(this.colorSelected);
    }
    onNoClick(){
      this.dialogRef.close();
    }

  }










@Component({
  selector: 'app-transformadores-reloaded',
  templateUrl: './transformadores-reloaded.component.html',
  styleUrls: ['./transformadores-reloaded.component.css']
})
export class TransformadoresReloadedComponent implements OnInit {
  isLoadingResults = true;
  dataGetTrafos:MatTableDataSource<any>;
  dataExcel:TransformadoresEtapas[];
  data3:Cliente[]=[];
  data4:Etapa[]=[];
  diego:ComboClientes[]=[];
  idTransfo:number;
  durationInSeconds=3;
  data2:Transformadores;
  data5:Etapa[]=[];
  data6:TipoEtapa[]=[];
  data7:EtapaTransfo[]=[];
  mensajeSnack:string;
  asincronia: any;
  arrayBool:boolean;
  muestre:boolean=false;
  vista:Vista[];
  trafosResponse:Transformadores[]=[];
  //view:View[];
  dataTipoTransfo:ComboTipoTransfo[]=[];
  data8TipoTransfo:TipoTransfo[]=[];
  //tiempoParc:TiempoParc[]=[];
  
  colores:Colores[]=[];
  displayedColumns1:string[]=['Accion']
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

  // TODAS las columnas
  allColumns: string[]= this.displayedColumns1.concat(this.displayedColumns2).concat(this.etapasColumns);
  dataSource;
  etapasActualizadas:boolean;

  private suscripcionMensajes: Subscription; // Aquí almacenaremos la suscripción

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, { static: false }) matTable: MatTable<any>;
  constructor(private ngZone: NgZone,private transformadoresService: TransformadoresService, private clientesService: ClienteService, private authService: AuthService, private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute,private _snackBar: MatSnackBar,private etapaService: EtapaService, private tipoEtapaService: TipoEtapaService, private getVistaService:VistaService, private tipoTransfoService: TipoTransfoService, private viewService: ViewService,private excelService: ExcelService, private mensajesService:MensajesService,private coloresService:ColoresService) { 
      
    }


    ngAfterViewInit() {
        this.ngZone.onMicrotaskEmpty.pipe(take(5)).subscribe(() => this.matTable.updateStickyColumnStyles());
    }
  ngOnInit(): void {
    
    this.getTrafos();
    this.getClientes();
    this.getTipoTransfo();
      
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

  actualizar(evento:any){
    if(evento==true)
    {
      this.getTrafos();
    }
  }



    mostrar(){
      this.muestre=true;
    }

    getColores():void{
      this.coloresService.getColores()
      .subscribe(colores=>{
        this.colores=colores;
        console.log(this.colores);
        this.isLoadingResults=false;
      },err=>{
        console.log(err),
        this.isLoadingResults=false;
      })
    }

    getTrafos():void{
      this.transformadoresService.getTrafos()
      .subscribe(transfo => {
        if(transfo.length>0){
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
          else
          {
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
        this.dataGetTrafos.sort = this.sort;
      }
      this.isLoadingResults = false;
      }, err => {
        this.isLoadingResults = false;
      });
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

    isGroup(index, item): boolean{
      return item.group;
    }

    

    dialogAddTransfo(){
      // this.titulo="Agregar Empleado";
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        id: 1,
        titulo: "Agregar Transformador",
        labelButton:"Agregar",
        diego:this.diego,
        dataTipoTransfo:this.dataTipoTransfo
        
      };
      // console.log("THIS TIPO TRANSFO", this.dataTipoTransfo)
      dialogConfig.width= '300px';
      const dialogRef = this.dialog.open(CourseDialog2Component, dialogConfig);
      dialogRef.afterClosed().subscribe(data => {
        if (data != undefined) {
          this.data3.forEach((e,i)=>{
            if(data.idCliente==this.data3[i].idCliente){
              
              data.nombreCli=this.data3[i].nombreCli;
            }
          })
          data.anio= new Date().getFullYear();
          data.mes= (new Date().getMonth())+1;
          data.prioridad= 1;
          data.fechaCreacion=new Date();
          if((data.cantidad) > 1){
            var nTransfo = data.cantidad;
            let arregloTransfo:Transformadores[]=[];
            for (let i = 0; i < nTransfo; i++) {
              arregloTransfo[i]=data;
            }
            console.log("ARREGLO TRANSFOR:",arregloTransfo);
            this.arraySubmit(arregloTransfo,this.dialog);
            arregloTransfo=[];
            this.isLoadingResults=false;
          }
          else{
            this.onFormSubmit(data, this.dialog);
            this.isLoadingResults=false;
          }
        }
        else{
          this.dialog.closeAll();
        }
        
      },err=>({})
      ,()=>setTimeout(()=>{
        this.getTrafos();
      },1000)
      )
      
    }
    
    arraySubmit(array,dialog:MatDialog){
      this.isLoadingResults=true;
      this.transformadoresService.addTransformadores(array).subscribe((res)=>{
        if(res!=undefined){
          this.isLoadingResults=false;
          this.mensajeSnack=`Transformador agregado`
          this.openSnackBar(this.mensajeSnack);
          this.arrayBool=true;
        }
      },
      err => {
        console.log(err);
        this.mensajeSnack=`No se ha agregado ningún transformador`
        this.openSnackBar(this.mensajeSnack);
        this.isLoadingResults=false;
        this.arrayBool=false;
      },
      ()=>{
        this.getTrafos();
      }
      )
    }
    
    onFormSubmit(form: NgForm, dialog: MatDialog) {
      this.isLoadingResults = true;
      this.transformadoresService.addTransformador(form).subscribe(
        (res) => {
          this.isLoadingResults = false;
          this.mensajeSnack=`Transformador agregado`
          this.openSnackBar(this.mensajeSnack);   
        },
        err => {
          this.mensajeSnack=`No se ha agregado ningún transformador`
          this.openSnackBar(this.mensajeSnack);
          console.log(err);
          this.isLoadingResults = false;
        }
        );
      }
      
      getClientes(): void {
        this.clientesService.getClientes()
        .subscribe(cliente => {
          // console.log("clientes",cliente);
          this.data3=cliente;
          this.diego =(<any[]>cliente).map(v => {
            return {id:v.idCliente,value:v.nombreCli,viewValue:v.nombreCli}
          })
        });
      };
      
      getTipoTransfo():void{
        this.tipoTransfoService.getTipoTransfo()
        .subscribe(tipoTransfo => {
          // console.log("clientes",cliente);
          this.data8TipoTransfo=tipoTransfo;
          this.dataTipoTransfo =(<any[]>tipoTransfo).map(v => {
            return {id:v.idTipoTransfo,value:v.nombreTipoTransfo,viewValue:v.nombreTipoTransfo}
          })
        });
      }
      
      getTransformador(id: number) {
        this.transformadoresService.getTransformador(id).subscribe(data => {
          this.idTransfo = data.idTransfo;
          });
        }
        
        deleteTransformador(id: number) {
          this.isLoadingResults = true;
          this.transformadoresService.deleteTransformador(id)
          .subscribe(res => {
            this.isLoadingResults = false;
            
            // this.router.navigate(['/supplier']);
          }, (err) => {
            console.log(err);
            this.isLoadingResults = false;
          }
          );
          
        }
        
        dialogDeleteTransfo(obj): void{
          obj.titulo="Borrar transformador?";
          obj.labelButton="Borrar";
          obj.diego=this.diego;
          this.getTransformador(obj.idTransfo);
          this.dialog.open(CourseDialog4Component,{data:obj});
          const dialogRef4 = this.dialog.open(CourseDialog4Component,{data:obj});
          dialogRef4.afterClosed().subscribe(res =>{
            if((res!=null))
            {
              this.deleteTransformador(res.idTransfo);
              this.openSnackBar('Transformador eliminado');
              this.getTrafos();
            }
            this.dialog.closeAll();
            setTimeout(()=>{
              this.getTrafos();
            },100);
          })
        }
        
        onUpdateSubmit(form: NgForm) {
          this.isLoadingResults = true;
          if(this.idTransfo!==null){
            this.transformadoresService.updateTransformador(this.idTransfo, form).subscribe(
              () => {
                // console.log("Esto es el form: ", form);
                this.isLoadingResults = false;
                // this.getTransformadores();
                // this.router.navigate(['/supplier']);
              },
              err => {
                console.log(err);
                this.isLoadingResults = false;
              }
              );
            }
          }
          
      
    dialogEditTransfo(obj): void {
      obj.titulo="Editar Transformador";
      obj.labelButton="Guardar";
      obj.diego=this.diego;
      
      obj.dataTipoTransfo=this.dataTipoTransfo;
      obj.habilitar=true;
      obj.cancelado=false;
      console.log("o be jota: ",obj);
      this.getTransformador(obj.idTransfo);
      const dialogRef3 = this.dialog.open(CourseDialog4Component, { data:obj});
      dialogRef3.afterClosed().subscribe(res =>{
        // console.log("detalle a ver:",res);
        if(res.cancelado==false){
          this.onUpdateSubmit(res);
          this.dialog.closeAll();
          this.mensajeSnack=`Transformador modificado`;
          this.openSnackBar(this.mensajeSnack);
          setTimeout(()=>{
            this.getTrafos();
          },100);
        }
        
      })
    }
  
    openSnackBar(mensaje) {
      this._snackBar.open(mensaje,"mensaje", {
         duration: this.durationInSeconds * 1000,
        });
    }
  
    getEtapas(){
      this.etapaService.getEtapas()
      .subscribe(etapa => {
        this.data4=etapa;
      })
    }
  
    getTipoEtapas(): Observable<any> {
      return this.tipoEtapaService.getTipoEtapas().pipe(
        tap(tipoEtapa => this.data6 = tipoEtapa)
      )
    }
  
    getEtapasporTransfo(id:number): Observable<Etapa[]> {
      return this.etapaService.getEtapasPorIdTransfo(id).pipe(
        tap(etapa => this.data5 = etapa)
      );
    }
  
    onRowClicked(row) {
      this.data2 = row;
      forkJoin([
        this.getEtapasporTransfo(this.data2.idTransfo),
        this.getTipoEtapas()
      ]).subscribe(() => {
        this.asignarEtapaTransfo();
        this.openDialogEtapaTransfo(this.data7);
      });    
    }
    
    asignarEtapaTransfo(){
      this.data7=[];
      this.data5.forEach((e,i)=>{
        let obj = new EtapaTransfo;     
        this.data6.forEach((e,j)=>{
            if(this.data5[i].idTipoEtapa==this.data6[j].idTipoEtapa)
            {
              
              obj.nombreEtapa=this.data6[j].nombreEtapa;
              
            }
          })
        obj.dateIni=this.data5[i].dateIni;
        obj.dateFin=this.data5[i].dateFin;
        obj.tiempoParc=this.data5[i].tiempoParc;
        obj.tiempoFin=this.data5[i].tiempoFin;   
        this.data7.push(obj);
        })
      // console.log(this.data7);
        // this.openDialogEtapaTransfo(this.data7);
      }
  
      openDialogEtapaTransfo(obj):void{
          
        const dialogRef5 = this.dialog.open(ShowInfoComponent,{
          width:'100%',
          position: {
            left: `100px`,
            
          },
          data:obj,
        })
        dialogRef5.afterClosed().subscribe(result => {
          // console.log('The dialog was closed');
        })
      }
      
      getDataExcel(): void {
        this.transformadoresService.getDataExcel().subscribe(res=>{this.dataExcel=res})
      }
    
  
  
      export(){
        console.log(this.dataGetTrafos.data);
        
        this.excelService.generateExcel(this.dataGetTrafos.data);
        
      }
  
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;      
        this.dataGetTrafos.filter = filterValue.trim().toLowerCase();
        if (this.dataGetTrafos.paginator) {
          this.dataGetTrafos.paginator.firstPage();
        }
      }
  
    logout() {
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    }

    // ngOnDestroy(): void {
    //   this.suscripcionMensajes.unsubscribe();  // Cancelamos la suscripción cuando se destruya el componente
    // }	
  
  }
  
  
  
  interface ComboClientes{
    id:number;
    value:string;
    viewValue:string;
  }
  
  interface ComboTipoTransfo{
    id:number;
    value:string;
    viewValue:string;
  }
  
  
  @Component({
    selector: "alta-transformadores",
    templateUrl: "alta-transformadores.html"
  })
  
  export class CourseDialog2Component{
  
  
  
    form: FormGroup;
    potencia:number;
    oPe:string;
    oTe:number;
    idTransfo:number;
    idCliente:number;
    nombreCli:string;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    observaciones:string;
    // rangoInicio:number;
    f:Cliente;
    cantidad:number;
    // rangoFin:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:ComboClientes[];
    dataTipoTransfo:ComboTipoTransfo[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<ComboClientes[]>;
    
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CourseDialog2Component>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.diego2=data1.diego;
        this.potencia=data1.potencia;
        this.oPe=data1.oPe;
        this.dataTipoTransfo=data1.dataTipoTransfo;
  
        // this.rangoInicio=data1.rangoInicio;
        // this.rangoFin=data1.rangoFin;
        this.oTe=data1.oTe;
        this.cantidad=data1.cantidad;
        this.idCliente=data1.idCliente;
        
  
        this.observaciones=data1.observaciones;
      
    }
  
    ngOnInit() {
      this.form = this.fb.group({
        potencia:[this.potencia,[Validators.required]],
        oPe:[this.oPe,[Validators.required]],
        cantidad:[this.cantidad,[Validators.required]],
        oTe:[this.oTe],
        idCliente:[this.idCliente],
        observaciones:[this.observaciones],
        nombreCli:[this.nombreCli],
        idTipoTransfo:[this.idTipoTransfo,[Validators.required]],
        nombreTipoTransfo:[this.nombreTipoTransfo],
        valueTransfo:[this.valueTransfo],
        f:[this.f]
      },);  

     //filtro
      this.filteredOptions = this.form.controls['f'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.viewValue),
        map(name => name ? this._filter(name) : this.diego2.slice())
      );
    }
    
    displayFn(comboCli: ComboClientes): string {
      return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
    }
  
    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();
  
      return this.diego2.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }
    
  
    changeClient(value) {
      return value.id;
    } 
  
    changeTipoTransfo(valueTransfo){
      return valueTransfo.id;
    }
  
    save() {
      let cliente=this.form.controls['f'].value;
      this.form.controls['idCliente'].setValue(cliente.id);
      this.form.controls['nombreCli'].setValue(cliente.value);
      this.dialogRef.close(this.form.value);
    }
  
    close() {
      this.dialogRef.close();
    }
  
  
  }
  
  
  @Component({
    selector: "editar-transformadores",
    templateUrl: "editar-transformadores.html"
  })
  export class CourseDialog4Component{
  
  
  
    form: FormGroup;
    potencia:number;
    oPe:string;
    oTe:number;
    idTransfo:number;
    idCliente:number;
    nombreCli:string;
    observaciones:string;
    anio:number;
    f:Cliente;
    mes:number;
    labelButton:string;
    titulo:string;
    data3: Cliente[] = [];
    diego2:ComboClientes[];
    matcher = new MyErrorStateMatcher();
    clientesService: ClienteService;
    selectedCliente: string;
    habilitar: boolean;
    cancelado:boolean;
    idTipoTransfo:number;
    nombreTipoTransfo:string;
    dataTipoTransfo:ComboTipoTransfo[];
    valueTransfo:TipoTransfo;
    filteredOptions: Observable<ComboClientes[]>;
  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CourseDialog4Component>,
      @Inject(MAT_DIALOG_DATA) data1
    ) {
        this.titulo=data1.titulo;
        this.labelButton=data1.labelButton;
        this.diego2=data1.diego;
        this.habilitar=data1.habilitar;
        this.idTransfo=data1.idTransfo;
        this.potencia=data1.potencia;
        this.oPe=data1.oPe;
        this.idTipoTransfo=data1.idTipoTransfo;
        this.dataTipoTransfo=data1.dataTipoTransfo;
        this.oTe=data1.oTe;
        this.idCliente=data1.idCliente;
        this.nombreCli=data1.nombreCli;
        this.observaciones=data1.observaciones;
        this.cancelado=data1.cancelado;
        this.f=data1.idClienteNavigation;
        this.anio=data1.anio;
        this.mes=data1.mes;
    }
  
    ngOnInit() {
      this.form = this.fb.group({
        idTransfo:[this.idTransfo],
        potencia:[this.potencia,[Validators.required]],
        oPe:[this.oPe,[Validators.required]],
        oTe:[this.oTe,[Validators.required]],
        idCliente:[this.idCliente],
        idTipoTransfo:[this.idTipoTransfo],
        observaciones:[this.observaciones],
        nombreCli:[this.nombreCli],
        f:[this.f],
        cancelado:[this.cancelado],
        mes:[this.mes],
        anio:[this.anio]
      }); 

      
      //filtro
      this.filteredOptions = this.form.controls['f'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.viewValue),
        map(name => name ? this._filter(name) : this.diego2.slice())
      );
      
      
      this.disabling();
      
    }
    
    displayFn(comboCli: ComboClientes): string {
          
          return comboCli && comboCli.viewValue ? comboCli.viewValue : '';
      }
      
    private _filter(name: string): ComboClientes[] {
      const filterValue = name.toLowerCase();
  
      return this.diego2.filter(option => option.viewValue.toLowerCase().indexOf(filterValue) === 0);
    }


    disabling(){
      if(this.labelButton=="Borrar"){
        this.form.disable();
      }
    }
  
    save() {
      // this.dialogRef.beforeClose().subscribe(()=>{
      //   this.diego2.forEach((e,i)=>{
      //     if(this.form.value.idCliente==this.diego2[i].id){
      //       this.form.value.nombreCli = this.diego2[i].value;
      //     }
      //   })
      // })
      console.log("Antes",this.form.value);
      if(this.form.controls['f'].value)
      {
        let cliente=this.form.controls['f'].value;
        console.log(cliente);
        this.form.controls['idCliente'].setValue(cliente.id);
        this.form.controls['nombreCli'].setValue(cliente.value);
      }
      console.log("Despues",this.form.value);
      this.form.value.cancelado=false;
      this.dialogRef.close(this.form.value);
    }
  
    close() {
      if(this.labelButton == "Guardar"){
        this.form.value.cancelado=true;
        this.dialogRef.close(this.form.value);
      }
      else if(this.labelButton == "Borrar") 
      {
        this.dialogRef.close();
      }
    }
  
  }
  
  @Component({
    selector: "info-etapa-transformadores",
    templateUrl: "info-etapa-transformadores.html"
  })
  export class ShowInfoComponent{
    displayedColumns: string[] = ['Nombre de Etapa', 'Fecha Inicio', 'Fecha Fin','Tiempo Parcial', 'Tiempo Fin'];
    dataEtapaPorTransfo:EtapaTransfo[]=[];
    nombreEtapa:string;
    dateIni:Date;
    dateFin:Date;
    tiempoParc:string;
    tiempoFin:string;
  
    constructor(private dialogRef: MatDialogRef<ShowInfoComponent>,
      @Inject(MAT_DIALOG_DATA) data1)
      {
  
        
          this.dataEtapaPorTransfo=data1;
      }
  
      ngOnInit(){
        // console.log(this.dataEtapaPorTransfo);
        this.dataEtapaPorTransfo;
      }
  
      onNoClick(): void {
        this.dialogRef.close();
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
  
  


