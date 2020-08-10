import { Component, OnInit, Inject } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ClienteService } from '../services/cliente.service';
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
import { MensajesService } from '../services/mensajes.service';  // Nuestro proveedor de mensajes
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  // data: Cliente[] = [];
  data:MatTableDataSource<any>;
  displayedColumns: string[] = ['idCliente', 'nombreCli'];
  isLoadingResults = true;

  constructor(private clienteService: ClienteService, private authService:AuthService, private router:Router,public dialog:MatDialog,private route:ActivatedRoute,private mensajesService: MensajesService) { }

  ngOnInit() {
    this.data=new MatTableDataSource();
    this.getClientes();
    // this.mensajesService.emite({
    //   tema: 'updateCli',
    //   contenido: 'Se ha agregado el Cliente'
    // });
  }

  getClientes(): void {
    this.clienteService.getClientes()
      .subscribe(cliente => {
        this.data.data = cliente;
        console.log(cliente);
        console.log(this.data.data);
        this.isLoadingResults = false;
      }, err => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  dialogAddCli(){
    const dialogConfig = new MatDialogConfig();
    // this.mensajesService.emite({
    //   tema: 'updateCli',
    //   contenido: 'Se ha agregado el Cliente'
    // });
    dialogConfig.data = {
      id: 1,
      titulo: "Agregar Cliente",
      labelButton:"Agregar"
    };
    dialogConfig.width= '300px';
    // dialogConfig.height='100%'
    this.dialog.open(CourseDialog3Component, dialogConfig);
    const dialogRef = this.dialog.open(CourseDialog3Component, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this.onFormSubmit(data, this.dialog);
        
      } else {
        this.dialog.closeAll();
        this.getClientes();
      }
    });
  }

  onFormSubmit(form: NgForm, dialog: MatDialog){
    this.isLoadingResults = true;
    this.clienteService.addCliente(form).subscribe(
      (res) => {
        
        this.isLoadingResults = false;
        dialog.closeAll();
        this.getClientes();
        
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

}

@Component({
  selector: "add-cliente",
  templateUrl: "add-cliente.html"
})

export class CourseDialog3Component{

  form: FormGroup;
  idCliente:number;
  nombreCli:string;
  titulo:string;
  labelButton:string;

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialog3Component>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
      this.titulo=data.titulo;
      this.labelButton=data.labelButton;
      this.idCliente=data.idCliente;
      this.nombreCli=data.nombreCli;
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      idCliente:[this.idCliente],
      nombreCli:[this.nombreCli,[Validators.required]],
    });
  }

  save() {
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
