import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { MensajesService } from 'src/app/services/mensajes.service';

// @Injectable({
//   providedIn: 'root'
// })

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  nombreUs = '';
  pass = '';
  matcher = new ErrorStateMatcher();
  isLoadingResults = false;  
  messageSnack:string;
  durationInSeconds=3;
  private us = new BehaviorSubject<Object>("");
  get usDetail() {
    return this.us.asObservable(); 
  }

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,private _snackBar: MatSnackBar, private mensajeService:MensajesService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'nombreUs' : [null, Validators.required],
      'pass' : [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.authService.login(form)
      .subscribe(res => {
        //console.log(res);
        if(res){
          this.mensajeService.enviarMensaje({
            isOp:res.isOp,
            sector:res.sector
          })
          this.us.next({isOp:res.isOp,sector:res.sector});
          if (res.token) {
             localStorage.setItem('token', res.token);
          }
          if(res.isOp==true)
          {
            this.router.navigate(['procesos']);
          }
          else{
            this.router.navigate(['trafos']);
          }
        }
        else{
          this.openSnackBar("Usuario o contraseña inválidos");
        }
      }, (err) => {
        
        // this.openSnackBar("Usuario o contraseña inválidos");
        console.log(err);
      });
  }

  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"mensaje", {
       duration: this.durationInSeconds * 1000,
      });
  }

  login(){

    this.router.navigate(['transformadores'])
  }

  register() {
    this.router.navigate(['register']);
  }

}

//Managing form validation

    export class MyErrorStateMatcher implements ErrorStateMatcher {
      isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
      }

}
