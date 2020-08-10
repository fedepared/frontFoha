
import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {OnInit,ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { LoginComponent } from './auth/login/login.component';
import { MensajesService } from './services/mensajes.service';
import { TokenInterceptor } from './interceptors/token.interceptors';
import { async } from 'rxjs/internal/scheduler/async';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  isOp:boolean;
  sector:number;
  isLoggedIn$: Observable<boolean>;
  isLogged:boolean=false;
//usDetail:Observable<Object>;

mobileQuery: MediaQueryList;
private _mobileQueryListener: () => void;
constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private router: Router,private matIconRegistry: MatIconRegistry,sanitizer: DomSanitizer,private authService:AuthService,private mensajesService:MensajesService) {
  this.mobileQuery = media.matchMedia('(max-width: 600px)');
  this._mobileQueryListener = () => changeDetectorRef.detectChanges();
  this.mobileQuery.addListener(this._mobileQueryListener);
  this.matIconRegistry.addSvgIcon(
    'fohama',
    sanitizer.bypassSecurityTrustResourceUrl('assets/logofohamaico.svg')
  );
  
  
}



ngOnInit() {
  
  
  console.log("this.isLoggedIn$: ",this.isLoggedIn$);
  
  this.isLoggedIn$=this.authService.checkSessionStorage();
  console.log("this.isLoggedIn$: ",this.isLoggedIn$);
  this.isOp=localStorage.getItem('isOp') === 'true';
  this.mensajesService.getMessage().subscribe(res=>{
    console.log("Respuesta: ",res);
    this.isOp=res.isOp;
  })

  
} 



ngOnDestroy(): void {
  this.mobileQuery.removeListener(this._mobileQueryListener);
}



logout() {
  this.authService.logout();
}

//Agregar un Refresh

}