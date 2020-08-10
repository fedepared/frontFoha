import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import {TipoTransfo } from '../models/tipoTransfo';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/TipoTransfo`;


@Injectable({
  providedIn: 'root'
})

export class TipoTransfoService {

  apiUrl = `${environment.baseUrl}/TipoTransfo`;

  constructor(private http: HttpClient) { }

  getTipoTransfo(): Observable<TipoTransfo[]> {
    return this.http.get<TipoTransfo[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched tipo Transfo')),
        catchError(this.handleError('getTipoTransfo', []))
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