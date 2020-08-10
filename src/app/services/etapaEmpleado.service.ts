import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { EtapaEmpleado } from '../models/etapaEmpleado';
import { Observable, of } from 'rxjs';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EtapaEmpleadoService {
  apiUrl = `${environment.baseUrl}/EtapaEmpleado`;
  

  constructor(private http: HttpClient) { }

  getEtapaEmpleados(): Observable<EtapaEmpleado[]> {
    return this.http.get<EtapaEmpleado[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched EtapaEmpleados')),
        catchError(this.handleError('getEtapaEmpleados', []))
      );
  }

  getEtapaEmpleado(id:string):Observable<EtapaEmpleado[]>{
    const url=`${this.apiUrl}/${id}`;
    return this.http.get<EtapaEmpleado[]>(url)
    .pipe(
      tap(_ => console.log(`fetched EtapaEmpleado id=${id}`)),
      catchError(this.handleError<EtapaEmpleado[]>(`getEmpleado id=${id}`))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}

  
