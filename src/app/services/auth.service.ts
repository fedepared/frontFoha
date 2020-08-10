import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = `${environment.baseUrl}/auth`;
  message:string;
  durationInSeconds:1;
  isOp:boolean=true;
  sector:number=0;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = new BehaviorSubject(false);
  userChange$ = new BehaviorSubject({isOp: null, sector: null});
  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }
  

  constructor(private http:HttpClient,private _snackBar: MatSnackBar,private router:Router) { 
    //this.isLoggedIn$.next(this.checkSessionStorage());
   }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(_ => 
          {
            //console.log(_);
            this.openSnackBar("Sesión iniciada");
            this.loggedIn.next(true);
            this.isLoggedIn$.next(true);
            this.isAuthenticated();
            this.userChange(_.isOp,_.sector);
            this.isOp=_.isOp;
            this.sector=_.sector;
            localStorage.setItem("sector",_.sector);
            localStorage.setItem("isOp",_.isOp);
          }
        ),
        catchError(this.handleError('login Failed', ))
      );
  }

  public checkSessionStorage():Observable<boolean>{
    let bool=(localStorage.getItem('token') !== null);
    this.isLoggedIn$.next(bool);
    return this.isLoggedIn$.asObservable();
  }

  userChange(isOp, sector){
    this.userChange$.next({
        isOp: isOp,
        sector: sector
    });
   }

   isLogged(){
     if(localStorage.getItem('sector'))
     {
       this.loggedIn.next(true);
      
     }
     
   }

   public isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  logout(){
    this.router.navigate(['/login']);
    localStorage.clear();
    this.isLoggedIn$.next(false);
  }
  
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(_ => this.log('register')),
        catchError(this.handleError('register',  err => err ))
      );
  }
  
  openSnackBar(mensaje) {
    this._snackBar.open(mensaje,"login!", {
       duration: this.durationInSeconds * 10,
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      
      
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return of(error.error as T);
    };
  }
  
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}
