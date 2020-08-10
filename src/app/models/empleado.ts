import { Etapa } from './etapa';
import {EtapaEmpleado} from './etapaEmpleado';
import { Sectores } from './sectores';

export class Empleado {
    idEmpleado: string;
    nombreEmp: string;
    idSector?:number;
    sector?:Sectores;

    // etapaEmpleado: EtapaEmpleado[];
    // idEtapa: Etapa;

    // nombreEtapaEmpleado:Etapa[];
}