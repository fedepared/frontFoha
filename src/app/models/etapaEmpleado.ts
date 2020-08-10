import { Etapa } from './etapa';
import { Empleado } from './empleado';


export class EtapaEmpleado{
    idEtapa: number;
    idEmpleado: string;
    dateIni:Date;
    dateFin?:Date;
    tiempoParc?:string;
    isEnded?:Boolean;
    tiempoFin?:string;
}