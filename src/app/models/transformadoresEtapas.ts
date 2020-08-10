import { Transformadores } from './transformadores';
import { EtapaTransfo } from './etapaTransfo';

export class TransformadoresEtapas{

   idTransfo:number;
   oTe:number;
   oPe:string;
   observaciones:string;
   potencia:number;
   rango:number;
   rangoInicio:number;
   rangoFin:number;
   nombreCli:string;
   etapaTransfo:EtapaTransfo[];
   
   constructor() {
      this.idTransfo=0,
      this.oTe=0,
      this.oPe="",
      this.observaciones="",
      this.potencia=0,
      this.rango=0,
      this.rangoInicio=0,
      this.rangoFin=0,
      this.nombreCli="",
      this.etapaTransfo=new Array<EtapaTransfo>()
    }
}