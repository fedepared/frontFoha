import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap } from 'rxjs/operators';
import  {Transformadores} from '../models/transformadores';
import { Observable, of} from 'rxjs';
import { TipoEtapa } from '../models/tipoEtapa';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = `${environment.baseUrl}/tipoEtapa`;

@Injectable({
  providedIn: 'root'
})
export class TipoEtapaService {
  apiUrl = `${environment.baseUrl}/tipoEtapa`;
  constructor(private http: HttpClient) { }

  getTipoEtapas(): Observable<TipoEtapa[]> {
    return this.http.get<TipoEtapa[]>(this.apiUrl)
      .pipe(
        tap(_ => this.log('fetched tipoEtapa')),
        catchError(this.handleError('getTipoEtapa', []))
      );
  }

  getTipoEtapa(id:number):Observable<TipoEtapa>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<TipoEtapa>(url).pipe(
      tap(_ => console.log(`fetched Etapa id=${id}`)),
      catchError(this.handleError<TipoEtapa>(`getEtapa id=${id}`))
    )
  }


  // addTransformador(transformador: any): Observable<Transformadores> {
  //   return this.http.post<Transformadores>(this.apiUrl, transformador, httpOptions).pipe(
  //     tap((transformadorRes: Transformadores) => console.log(`Transformador agregado con el id=${transformadorRes.idTransfo}`)),
  //     catchError(this.handleError<Transformadores>('addTransformador'))
  //   );
  // }

  // updateTransformador (id: number, transformador: any): Observable<any> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.put(url, transformador, httpOptions).pipe(
  //     tap(_ => console.log(`updated Transformador id=${id}`)),
  //     catchError(this.handleError<any>('updateTranformador'))
  //   );
  // }

  // deleteTransformador (id: number): Observable<Transformadores> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.delete<Transformadores>(url, httpOptions).pipe(
  //     tap(_ => console.log(`deleted Transformadores id=${id}`)),
  //     catchError(this.handleError<Transformadores>('delete Transformadores'))
  //   );
  // }

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
