import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject,Subject } from 'rxjs'; // Tenemos que importar los observables de la librería RxJS
import { filter } from 'rxjs/operators';
import { OVERLAY_CONTAINER_PROVIDER_FACTORY } from '@angular/cdk/overlay/typings/overlay-container';

// Interfaz para la forma del objeto mensaje
// interface Mensaje {
// 	tema: string;
// 	contenido: string;
// }
interface UsData{
	isOp:boolean;
	sector:number;
}

/*
@Injectable({
	providedIn: 'root' // Así se establece a partir de Angular 6 el ámbito de la instancia del servicio
})*/
export class MensajesService {
	user:UsData;
	private enviarMensajeSubject = new Subject<UsData>();
	private enviarLoggedInSubject = new Subject<any>();
	enviarLoggedObservable = this.enviarLoggedInSubject.asObservable();
	enviarMensajeObservable = this.enviarMensajeSubject.asObservable();
	// private mensajero: BehaviorSubject<Mensaje> = new BehaviorSubject({
	// 	tema: '',
	// 	contenido: ''
	// });

	constructor() { }

	// Método público para quien se quiera suscribir a los mensajes
	// public escucha(): Observable<Mensaje> {
	// 	return this.mensajero.asObservable();
	// }

	// Método público para quien quiera emitir un mensaje
	// public emite(msj: Mensaje): void {
	// 	this.mensajero.next(msj);
	// }
	getMessage(): Observable<any> {
        return this.enviarMensajeSubject.asObservable();
    }
	enviarMensaje(mensajeUs:UsData){
		this.user=mensajeUs;
		this.enviarMensajeSubject.next(mensajeUs);
	}
	// enviarMensajeLogged(){
	// 	this.enviarLoggedInSubject.next(mensaje);
	// }


}
