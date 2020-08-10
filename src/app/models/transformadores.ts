import { Etapa } from './etapa';
import { Cliente } from './cliente';

export class Transformadores{
    idTransfo:number;
    oTe:number;
    oPe:string;
    observaciones:string;
    potencia:number;
    rango:number;
    rangoInicio:number;
    rangoFin:number;
    idCliente?:number;
    nombreCli:string;
    fechaCreacion?: Date;
    idTipoTransfo?:number;
    anio:number;
    mes:number;
    prioridad:number;
    etapa:Etapa[];
    idClienteNavigation:Cliente;

}