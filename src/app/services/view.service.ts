import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import { View } from '../models/view';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/View`;


@Injectable({
  providedIn: 'root'
})

export class ViewService {

  apiUrl = `${environment.baseUrl}/View`;

  constructor(private http: HttpClient) { }



  getView(): Observable<View[]> {
    return this.http.get<View[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched View')),
        catchError(this.handleError('getView', []))
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