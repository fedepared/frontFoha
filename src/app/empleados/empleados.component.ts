import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from "@angular/material/dialog";
import { Component, OnInit, Inject } from "@angular/core";
import { Empleado } from "../models/empleado";
import { EmpleadoService } from "../services/empleado.service";
import { AuthService } from "../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  NgForm,
  FormControl,
  FormGroupDirective,
  Validators
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { Sectores } from '../models/sectores';
import { SectoresService } from '../services/sectores.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-empleados",
  templateUrl: "./empleados.component.html",
  styleUrls: ["./empleados.component.css"]
})
export class EmpleadosComponent implements OnInit {
  //data: Empleado[] = [];
  data:MatTableDataSource<any>;
  displayedColumns: string[] = [ "accion","idEmpleado", "nombreEmp","sector"];
  isLoadingResults = true;
  titulo:String;
  empleadoForm: FormGroup;
  formBuilder: any;
  nombreEmp = "";
  idEmpleado: string;
  empleado: Empleado = {
    idEmpleado: null,
    nombreEmp: "",
    
  };
  constructor(
    private empleadoService: EmpleadoService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.data=new MatTableDataSource();
    this.getEmpleados();
  }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      empleado => {
        this.data.data = empleado;
        //console.log(empleado);
        console.log(this.data);
        this.isLoadingResults = false;
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  getEmpleado(id: string) {
    this.empleadoService.getEmpleado(id).subscribe(data => {
      this.idEmpleado = data.idEmpleado;
    });
  }

  onUpdateSubmit(form: NgForm) {
    this.isLoadingResults = true;
    this.empleadoService.updateEmpleado(this.idEmpleado, form).subscribe(
      res => {
        this.isLoadingResults = false;
        setTimeout(()=>{
          this.getEmpleados();
        },10)
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
    
  }

  deleteEmpleado(id: string) {
    this.isLoadingResults = true;
    this.empleadoService.deleteEmpleado(id)
      .subscribe(res => {
          this.isLoadingResults = false;
          // this.router.navigate(['/supplier']);
        }, (err) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  dialogDeleteEmp(obj): void{
    obj.titulo="Borrar empleado?";
    obj.labelButton="borrar"
    this.getEmpleado(obj.idEmpleado);

    this.dialog.open(CourseDialogComponent,{data:obj});
    const dialogRef3 = this.dialog.open(CourseDialogComponent,{data:obj});
    
    dialogRef3.afterClosed().subscribe(res =>{
      if((res!=null))
      {
        this.deleteEmpleado(res.idEmpleado);
      }
      this.dialog.closeAll();
      this.getEmpleados();
    })
  }

  dialogEditEmp(obj): void {
    obj.titulo="Editar empleado";
    obj.labelButton="Guardar"
    this.getEmpleado(obj.idEmpleado);
    console.log(obj);
    this.dialog.open(CourseDialogComponent, { data:obj});
    const dialogRef2 = this.dialog.open(CourseDialogComponent, { data:obj});
    dialogRef2.afterClosed().subscribe(res =>{
      console.log(res);
      this.onUpdateSubmit(res);
      this.dialog.closeAll();
      this.getEmpleados();
    })
  }

  dialogAddEmp(): void {
    this.titulo="Agregar Empleado";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar empleado",
      labelButton:"Agregar"
    };
    this.dialog.open(CourseDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.onFormSubmit(data, this.dialog);
      } else {
        this.dialog.closeAll();
        this.getEmpleados();
      }
    });
  }

  onFormSubmit(form: NgForm, dialog: MatDialog) {
    this.isLoadingResults = true;
    this.empleadoService.addEmpleado(form).subscribe(
      (res: { [x: string]: any }) => {
        const empleado = res["empleadoResponse"];
        const idEmpleado = empleado["idEmpleado"];
        this.isLoadingResults = false;
        // this.router.navigate(['/supplier-details', id]);
        dialog.closeAll();
        this.getEmpleados();
      },
      err => {
        console.log(err);
        this.isLoadingResults = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;      
    this.data.filter = filterValue.trim().toLowerCase();
    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}

@Component({
  selector: "alta-empleados",
  templateUrl: "alta-empleados.html"
})
export class CourseDialogComponent {
  
  form: FormGroup;
  idEmpleado: number;
  nombreEmp: string;
  idSector:number;
  nombreSector:string;
  matcher = new MyErrorStateMatcher();
  titulo:string;
  labelButton:string;
  sectores:Sectores[]=[];
  sector:Sectores;

  constructor(
    private sectoresService:SectoresService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.titulo=data.titulo;
    this.labelButton=data.labelButton;
    this.idEmpleado = data.idEmpleado;
    this.nombreEmp = data.nombreEmp;
    this.idSector=data.idSector;
    //this.nombreSector=data.sector.nombreSector;
    this.sector=data.sector;
    
  }

  ngOnInit() {
    this.getSectores();
    this.form = this.fb.group({
      nombreEmp: [this.nombreEmp, [Validators.required]],
      idEmpleado: [this.idEmpleado, [Validators.required]],
      idSector:[this.idSector]
    });
    this.disabling();
    console.log(this.sector);
  }

  disabling(){
    if(this.labelButton=="borrar"){
      this.form.disable();
    }
  }

  getSectores(): void {
    this.sectoresService.getSectores().subscribe(
      sectores => {
        this.sectores = sectores;
        //console.log(empleado);
        console.log(this.sectores);
        
      },
      err => {
        console.log(err);
        
      }
    );
  }

  save() {
    console.log(this.form.value)
    this.dialogRef.close(this.form.value);
  }

  close() {
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
