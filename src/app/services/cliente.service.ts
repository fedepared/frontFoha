import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { Observable, of } from 'rxjs';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  apiUrl = `${environment.baseUrl}/Cliente`;
  

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }

  addCliente(cliente: any): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, httpOptions).pipe(
      tap((clienteRes: Cliente) => console.log(`Cliente agregado con el id=${clienteRes.idCliente}`)),
      catchError(this.handleError<Cliente>('addCliente'))
    );
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

  
