import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Colores } from '../models/colores';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/Colores`;

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
  apiUrl = `${environment.baseUrl}/Colores`;

  constructor(private http: HttpClient) { }

  getColores(): Observable<Colores[]> {
    return this.http.get<Colores[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched Colores')),
        catchError(this.handleError('getColores', []))
      );
  }

  addColores(colores: any): Observable<Colores> {
    return this.http.post<Colores>(this.apiUrl, colores, httpOptions).pipe(
      tap((colorRes: Colores) => console.log(`Color agregado con el id=${colorRes.idColor}`)),
      catchError(this.handleError<Colores>('addColor'))
    );
  }

  deleteColor (id: number): Observable<Colores> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Colores>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted color id=${id}`)),
      catchError(this.handleError<Colores>('delete Color'))
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

  
