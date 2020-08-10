
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDragEnd, DragRef} from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import clonedeep from 'lodash.clonedeep';
import { TransformadoresService } from '../services/transformadores.service';
import { Transformadores } from '../models/transformadores';
import { Component, ViewChild, OnInit, Inject, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { EventEmitter } from 'protractor';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DomElementSchemaRegistry } from '@angular/compiler';
import * as _ from 'lodash';

export interface OrderTransfo{
  id:string;
  lista:Transformadores[];
}

interface Mes {
  value: number;
  viewValue: string;
}



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  isLoadingResults=true;
  
  //lista
  connectedTo = [];
  data=[];
  dataB=[];
  transfoInter:OrderTransfo[]=[];
  orderFin:any[]=[];
  anio:number;
  mes:Mes[]=[
    {value:1,viewValue:"Enero"},
    {value:2,viewValue:"Febrero"},
    {value:3,viewValue:"Marzo"},
    {value:4,viewValue:"Abril"},
    {value:5,viewValue:"Mayo"},
    {value:6,viewValue:"Junio"},
    {value:7,viewValue:"Julio"},
    {value:8,viewValue:"Agosto"},
    {value:9,viewValue:"Septiembre"},
    {value:10,viewValue:"Octubre"},
    {value:11,viewValue:"Noviembre"},
    {value:12,viewValue:"Diciembre"}

  ];
  private lastSingleSelection: number;
  public selections: number[] = [];
  private currentSelectionSpan: number[] = [];
  public dragging: DragRef = null;


  constructor(private transformadoresService:TransformadoresService,public dialog: MatDialog,private _snackBar: MatSnackBar,private eRef: ElementRef, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getOrden();
    //this.getTransformadores();
    
  }

  getTransformadores(){
    // this.transformadoresService.getTransformadores()
    // .subscribe(transfo => {
    //   this.dataSource = new MatTableDataSource(transfo);
    //   this.dataSource2 = new MatTableDataSource(transfo);
    //   this.dataTransfo = transfo;
    //   // console.log(this.data);
    //   this.isLoadingResults = false;
    // }, err => {
    //   // console.log(err);
    //   this.isLoadingResults = false;
    // });
  }

  getOrden(){
    this.transformadoresService.getOrden()
    .subscribe(transfoOrden=>{
      this.data=transfoOrden;
      console.log(this.data);
      let anterior=null;
      var transfo:OrderTransfo={id:'',lista:[]};
      
      this.data.forEach((e,i )=> {
        e.forEach((f,j) => {     
          transfo.id=`Año:${f.anio} Mes:${f.mes}`;
          transfo.lista.push(f);
          if((`Año:${f.anio} Mes:${f.mes}`)!=anterior)
          {
            this.connectedTo.push(`Año:${f.anio} Mes:${f.mes}`);
          }
          anterior=`Año:${f.anio} Mes:${f.mes}`;
        });
        this.transfoInter.push(transfo);
        transfo={id:'',lista:[]};
      })
        

      console.log("Transfo Inter",this.transfoInter);
      console.log(this.connectedTo);
      let transfoList={id:'',lista:[]};
      this.connectedTo.forEach((e)=>{
        transfoList={
          id:e,
          lista:[],
        }
        this.orderFin.push(transfoList);
      })
      
      
      this.transfoInter.forEach((e)=>{
        var l = this.orderFin.findIndex(o => o.id === e.id);
        if (this.orderFin[l]) { this.orderFin[l] = e } else { this.orderFin.push(e) };

      })
      console.log(this.orderFin);
    },err=>{
      this.isLoadingResults=false;
    })
  }



  save(a:CdkDropList){
    console.log(this.orderFin);
    this.orderFin.forEach((e)=>{
      let anio:number=parseInt(e.id.slice(4,8))
      let mes:number=parseInt(e.id.slice(13,15))
      console.log(mes)
      e.lista.forEach((a,i)=>{
        // console.log(a);
        // console.log(a.idTransfo);
        a.anio=anio;
        a.mes=mes;
        a.prioridad=i
        this.transformadoresService.updateTransformador(a.idTransfo,a)
        .subscribe(transfo => {
          //console.log(transfo);
          this.openSnackBar("Orden Guardado!","Ok")
          
          // this.getOrden();
          this.isLoadingResults = false;
          }, err => {
            console.log(err);
            this.isLoadingResults = false;
          },()=>console.log(""));
      })
      
    })
  }

  

  addAnioMes():void{
    const dialogRef = this.dialog.open(AltaAnioMes, {
      width: '250px',
      data: {anio: this.anio, mes: this.mes}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var nuevoPer:OrderTransfo={id:`Año:${result.anio} Mes:${result.mes}`,lista:[]};
        this.connectedTo.push(`Año:${result.anio} Mes:${result.mes}`);
        this.transfoInter.push(nuevoPer);
        this.orderFin.push(nuevoPer);
      }
    });
  }

  

  
  drop(event: CdkDragDrop<string[]>) {
    let orderTra:any={id:'',lista:[]};
    let arrayTransfo:any[]=[];
    let arrayTransfoAntes:any[]=[];
    let arrayTransfoDespues:any[]=[];
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      event.container.data.forEach((e)=>{
        arrayTransfo.push(e);
      })
      orderTra={
        id:event.container.id,
        lista:arrayTransfo
      }
           

      var i = this.orderFin.findIndex(o => o.id === orderTra.id);
      if (this.orderFin[i]) { this.orderFin[i] = orderTra } else { this.orderFin.push(orderTra) };
      console.log("despues",this.orderFin);
      
      


      
      
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data,event.previousIndex,event.currentIndex);
      console.log(event.previousContainer.data);
      console.log(event.container.data)
      event.previousContainer.data.forEach((e)=>{
        arrayTransfoAntes.push(e);
      })
      orderTra={
        id:event.previousContainer.id,
        lista:arrayTransfoAntes
      }
      var i = this.orderFin.findIndex(o => o.id === orderTra.id);
      if (this.orderFin[i]) { this.orderFin[i] = orderTra } else { this.orderFin.push(orderTra) };

      event.container.data.forEach((e)=>{
        arrayTransfoDespues.push(e);
      })
      orderTra={
        id:event.container.id,
        lista:arrayTransfoDespues
      }
           

      var j = this.orderFin.findIndex(o => o.id === orderTra.id);
      if (this.orderFin[j]) { this.orderFin[j] = orderTra } else { this.orderFin.push(orderTra) };
      console.log("nuevo arreglo",this.orderFin);
                      
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}

@Component({
  selector: 'altaAnioMes',
  templateUrl: 'altaAnioMes.html',
})
export class AltaAnioMes {
  mes:Mes[]=[];
  selected;
  anio:number=0;
  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AltaAnioMes>,) {
    this.mes=data.mes;
  }
  
  ngOnInit(){
    // console.log(this.mes);
  }

  save(){
    let data={

      anio:this.anio,
      mes:this.selected
    }
    this.dialogRef.close(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}