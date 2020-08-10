import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ColoresService } from '../services/colores.service';
import { Colores } from '../models/colores';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-leyendas',
  templateUrl: './leyendas.component.html',
  styleUrls: ['./leyendas.component.css']
})
export class LeyendasComponent implements OnInit {
  leyendaText:string;
  color:string='#278ce2';
  isLoadingResults = false;
  data:Colores=new Colores();
  @Output() colorUpdated=new EventEmitter<Boolean>();
  constructor(private coloresService:ColoresService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  addLeyenda(){
    this.data.codigoColor=this.color;
    this.data.leyenda=this.leyendaText;
    // console.log(this.data);
    this.coloresService.addColores(this.data)
    .subscribe(color => {
      this.openSnackBar("Referencia agregada", "Ok");
      this.colorUpdated.emit(true);
      this.isLoadingResults = false;
    }, err => {
      // console.log(err);
      this.colorUpdated.emit(false);
      this.isLoadingResults = false;
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
