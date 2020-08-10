import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;
  constructor(private authService:AuthService, private router:Router){
    this.isLoggedIn$=this.authService.checkSessionStorage();
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // if(!this.isLoggedIn$)
    // {
    //   console.log("No estas logueado");
    //   this.router.navigate(['login']);
    // }
    // if(localStorage.getItem('isOp') === 'true')
    // {
    //   this.router.navigate(['procesos'])
    // }
    return true;
  }
  
}
