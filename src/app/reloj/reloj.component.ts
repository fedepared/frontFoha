import { Component, OnInit, Input, OnChanges,EventEmitter,Output, Inject } from '@angular/core';
import { Etapa } from '../models/etapa';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado';
import { Timer } from 'easytimer.js';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtapaService } from '../services/etapa.service';
import { EtapaEmpleado } from '../models/etapaEmpleado';
import { AuthService } from '../services/auth.service';
// import { DialogData } from '../timer/timer.component';

interface ComboEmpleado{
  id:string;
  nombreEmpleado:string;
  value:string;
  viewValue:string;
}

export interface DialogData {
  ok:boolean;
  empleadoValue: string;
  transfoValue: string;
  etapaValue:string;
}

@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit, OnChanges {
  
  @Input('procesoSelected') procesoElegido: Etapa;
  @Output() procesoUpdated = new EventEmitter<boolean>();

  proceso:Etapa;
  numEtapa:number=0;
  selectedProceso:Boolean=false;
  dataEmpleados:Empleado[]=[];
  comboEmpleados:ComboEmpleado[];
  isLoadingResults=true;
  empleado:ComboEmpleado;
  nuevoEmpleado:ComboEmpleado;
  empleadosAdded:ComboEmpleado[]=[];
  arr:ComboEmpleado[]=[];
  play=true;
  isPause=false;
  isStop=false;
  class:boolean;
  tiempo:Timer=new Timer();
  tiempoNuevo:Timer=new Timer();
  comienzo=true;
  ok=false;
  empleadosProcesoPausado:ComboEmpleado[]=[];
  sector:number=0;
  constructor(private empleadoService:EmpleadoService,private _snackBar: MatSnackBar,private etapaService:EtapaService,public dialog:MatDialog,private authService:AuthService) { }


  ngOnInit(): void {
    document.body.scrollIntoView(false);
    this.selectedProceso=true;
    this.proceso=this.procesoElegido;
    this.numEtapa=this.proceso.numEtapa;
    this.arr.push({id:"",nombreEmpleado:"",value:"",viewValue:""});
    // this.authService.userChange$.subscribe(res => {
    //   this.sector=res.sector;
    //   console.log(this.sector);
    // })
    this.sector=parseInt(localStorage.getItem('sector'));
    this.getEmpleados();
    console.log(this.proceso);
   
    
  }

  ngOnChanges() {
    

    
    
  }

  

  numeroEtapa(evento){
    this.numEtapa=evento.target.value;
  }

  

  getEmpleados(): void {
    this.empleadoService.getEmpleados()
    .subscribe(empleados => {
      this.dataEmpleados = empleados;
      this.dataEmpleados=this.dataEmpleados.filter(sector=>sector.idSector==this.sector)
      
      this.comboEmpleados =(<any[]>this.dataEmpleados).map(v => {
        return {
          id:v.idEmpleado,nombreEmpleado:v.nombreEmp,value:v.nombreEmp,viewValue:v.nombreEmp
        }
      })
      
      
      if(this.proceso.etapaEmpleado.length>0)
      {
        let max=new Date(Math.max.apply(null, this.proceso.etapaEmpleado.map(function(e) {
          return new Date(e.dateIni);
        })));
        console.log(max);
        for(var a of this.proceso.etapaEmpleado)
        {
          let fecha=new Date(a.dateIni); 
          console.log(fecha);         
          if(fecha.getTime()===max.getTime())
          {
            console.log(this.comboEmpleados);
            let empleado=this.comboEmpleados.find(x=>x.id==a.idEmpleado);
            console.log(empleado);
            this.empleadosProcesoPausado.push(empleado);
          }
        }
      }
      console.log(this.arr)
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  empleadoSelected(empleado){
    this.empleado=empleado;
    console.log(this.empleado);
  }

  addEmpleado(nuevoEmpleado){
    this.empleadosAdded.push(nuevoEmpleado);
    this.empleadosAdded=[...new Set(this.empleadosAdded)];
  }

  addSelect(){
    let empleadoSelected:ComboEmpleado={id:"",nombreEmpleado:"",value:"",viewValue:""};
    this.arr.push(empleadoSelected);
    
  }

  openSnackBar(mensaje,tiempo) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: tiempo * 1000,
      });
  }

  //TIMER EN SI
  start(){
    if(this.proceso && this.numEtapa && this.empleadosAdded)
    {
      this.empleadosAdded=this.empleadosAdded.slice(((this.empleadosAdded.length))-this.arr.length,this.empleadosAdded.length);
      let empezado:Boolean;
      let fechaProcesoReiniciado=new Date();
      this.play=!this.play;
      this.isPause=!this.isPause;
      this.isStop=true;
      this.class=true;
      this.openSnackBar("Proceso iniciado",2);

      //Si el proceso está pausado
      if(this.proceso.dateIni != null && this.proceso.dateFin == null)
      {
        empezado=true;
        let arrayTiempo=this.proceso.tiempoParc.split(":");
        console.log(arrayTiempo);
        this.tiempoNuevo.start();
        this.tiempo.start({startValues:{days:parseInt(arrayTiempo[0]),hours:parseInt(arrayTiempo[1]),minutes:parseInt(arrayTiempo[2]),seconds:parseInt(arrayTiempo[3])}});
        console.log(this.tiempo);
        if(this.comienzo==true){
          this.comienzo=false;
        }
      }

      //Si el proceso se inicia por primera vez 
      if(this.proceso.dateIni == null && this.proceso.dateFin == null)
      {
        empezado=false;
        this.tiempo.start();
        if(this.comienzo==true){
          let fechaInicio=new Date();
          this.proceso.dateIni=fechaInicio;
          this.proceso.numEtapa=this.numEtapa;
        }
      }

      let empleados=new Array<Empleado>();
      // empleados.push({idEmpleado:this.empleado.id,nombreEmp:this.empleado.nombreEmpleado});
      
      if(this.empleadosAdded.length>0){
        for(var a of this.empleadosAdded)
        {
          empleados.push({idEmpleado:a.id , nombreEmp:a.nombreEmpleado})
        }
      }
      console.log(empleados);
      let preEtapaEmpleado=new Array<EtapaEmpleado>();

      for (var b of empleados)
      {
        if(empezado==true)
        {
          preEtapaEmpleado.push({idEmpleado:b.idEmpleado,dateIni:fechaProcesoReiniciado,idEtapa:this.proceso.idEtapa,tiempoParc:"00:00:00:00"})
        }
        else{
          preEtapaEmpleado.push({idEmpleado:b.idEmpleado,dateIni:this.proceso.dateIni,idEtapa:this.proceso.idEtapa,tiempoParc:"00:00:00:00"})
        }
      }
      this.proceso.etapaEmpleado=preEtapaEmpleado;
      this.proceso.idColor=1030;
      console.log(this.proceso);
      this.etapaService.updateEtapaTimer(this.proceso.idEtapa,this.proceso).subscribe(
        (res) => {

              this.isLoadingResults = false;
        },
        err => {
          console.log(err);
          this.isLoadingResults = false;
        },
        ()=>{
          this.procesoUpdated.emit(true);
        }
      );
      

      
      
      this.comienzo=false;

    }
    else
    {
      this.openSnackBar("Debe elegir un proceso, un/os empleado/s,y un número de referencia",5);
    }
  }

  pause(){
    this.tiempo.pause();
    this.tiempoNuevo.pause();
    let parcial=this.tiempo.getTimeValues().toString(['days','hours','minutes','seconds']);
    console.log("Tiempo parcial",this.tiempo.getTimeValues().toString())
    let parcialNuevo=this.tiempoNuevo.getTimeValues().toString(['days','hours','minutes','seconds']);
    console.log("Tiempo parcial 2",this.tiempoNuevo.getTimeValues().toString())
    this.openSnackBar(`Proceso pausado`,3);
    this.isPause=!this.isPause;
    this.play=!this.play;
    this.class=false;
    this.proceso.tiempoParc=parcial;
    for(var b of this.proceso.etapaEmpleado)
    {
      b.tiempoParc=parcialNuevo;
    }
    this.proceso.idColor=9;
    this.proceso.isEnded=false;
    console.log(this.proceso);
    this.etapaService.updateEtapaTimer(this.proceso.idEtapa,this.proceso).subscribe(
      (res) => {

            this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      },
      ()=>setTimeout(()=>{
        this.procesoUpdated.emit(true);
      },500)
    );
    
    this.comienzo=false;
  }

  stop(){

    this.openDialog();
    this.isStop=!this.isStop;
    this.isPause=false;
    this.play=true;
    
  }

  openDialog(){
    const dialogRef=this.dialog.open(DialogFinalizarProceso,{
      width:'300px',
      data: {ok:this.ok}
    })


    dialogRef.afterClosed().subscribe((confirmado:Boolean)=>{
      if(confirmado){
        let fechaFin=new Date();
        let fin;
        
        if(this.tiempo.getTotalTimeValues().toString()==="00:00:00")
        {
          fin=this.proceso.tiempoParc;
          
        }
        else
        {
          fin=this.tiempo.getTimeValues().toString(['days','hours','minutes','seconds']);
        }
        console.log("Tiempo de finalización",fin);
        //let finNuevo=this.tiempoNuevo.getTimeValues().toString(['days','hours','minutes','seconds']);
        for (var c of this.proceso.etapaEmpleado)
        {
          c.dateFin=fechaFin;
          //c.tiempoFin=finNuevo;
        }
        this.proceso.dateFin=fechaFin;
        this.proceso.tiempoFin=fin;
        this.proceso.isEnded=true;
        this.proceso.tiempoParc="Finalizada";
        this.proceso.idColor=10;
        console.log(this.proceso);
        this.etapaService.updateEtapaTimer(this.proceso.idEtapa,this.proceso).subscribe(
          (res) => {

            this.isLoadingResults = false;
          },
          err => {
            console.log(err);
            this.isLoadingResults = false;
          }
        );
        this.proceso=null;
        this.empleado=null;
        this.comienzo=true;
        this.class=false;
        this.openSnackBar('Proceso Finalizado!',5);
        this.tiempo.reset();
        setTimeout(()=>{
          this.procesoUpdated.emit(true);
        },500)
        this.tiempo.stop();
        this.tiempoNuevo.stop();
        
        

      }
      else{
        // console.log("No cancelado");
      }
    })

  }

}



@Component({
  selector: 'finalizar-proceso',
  templateUrl: 'finalizar-proceso.html',
})

export class DialogFinalizarProceso {

  ok:boolean;
  constructor(
    public dialogRef: MatDialogRef<DialogFinalizarProceso>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.ok=data.ok;
    }
    ngOnInit() {

    }

  onClick(){
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}


