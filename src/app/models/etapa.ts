import { Time } from '@angular/common';
import { TipoEtapa } from './tipoEtapa';
import { Colores } from './colores';
import {Empleado} from './empleado';
import { EtapaEmpleado } from './etapaEmpleado';
import { Transformadores } from './transformadores';

export class Etapa{
    idEtapa: number;
    dateIni?:Date;
    dateFin?:Date;
    isEnded?:boolean;
    tiempoParc?:string;
    tiempoFin?:string;
    idColorNavigation:Colores;
    idTransfo:number;
    idTipoEtapa:number;
    tipo:TipoEtapa;
    idColor:number;
    color:Colores;
    etapaEmpleado:EtapaEmpleado[];
    numEtapa:number;
    idTransfoNavigation:Transformadores;



}