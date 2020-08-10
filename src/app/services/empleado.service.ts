import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Empleado} from '../models/empleado';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.baseUrl}/empleado`;

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  
  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(apiUrl)
      .pipe(
        tap(_ => this.log('fetched Empleados')),
        catchError(this.handleError('getEmpleados', []))
      );
  }

  getEmpleado(id:string):Observable<Empleado>{
    const url=`${apiUrl}/${id}`;
    return this.http.get<Empleado>(url).pipe(
      tap(_ => console.log(`fetched Empleado id=${id}`)),
      catchError(this.handleError<Empleado>(`getEmpleado id=${id}`))
    )
  }

  addEmpleado (empleado: any): Observable<Empleado> {
    return this.http.post<Empleado>(apiUrl, empleado, httpOptions).pipe(
      tap((empleadoRes: Empleado) => console.log(`empleado agregado con el id=${empleadoRes.idEmpleado}`)),
      catchError(this.handleError<Empleado>('addEmpleado'))
    );
  }

  updateEmpleado (id: string, empleado: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, empleado, httpOptions).pipe(
      tap(_ => console.log(`updated Empleado id=${id}`)),
      catchError(this.handleError<any>('updateEmpleado'))
    );
  }

  deleteEmpleado (id: string): Observable<Empleado> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Empleado>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Empleado id=${id}`)),
      catchError(this.handleError<Empleado>('delete Empleado'))
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
