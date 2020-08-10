import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import {Vista } from '../models/Vista';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/Vista`;


@Injectable({
  providedIn: 'root'
})

export class VistaService {

  apiUrl = `${environment.baseUrl}/Vista`;

  constructor(private http: HttpClient) { }



  getVista(): Observable<Vista[]> {
    return this.http.get<Vista[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Vista')),
        catchError(this.handleError('getVista', []))
      );
  }
  getVistaNull(): Observable<Vista[]> {
    return this.http.get<Vista[]>(`${this.apiUrl}/GetVistaNull`)
      .pipe(
        tap(_ => this.log('fetched Vista Nulls')),
        catchError(this.handleError('getVista', []))
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

  private log(message: string) {
    console.log(message);
  }
}