import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {View} from '../models/view';
import * as moment from 'moment';
import { Transformadores } from '../models/transformadores';
//import { DatePipe } from '../../../node_modules/@angular/common';

const MAP_NOMBRE_ETAPA: { [tipoEtapa: string]: number} = {
  "documentacion":1,
  "bobinaBT1":2,
  "bobinaBT2":3,
  "bobinaBT3":4,
  "bobinaAT1":5,
  "bobinaAT2":6,
  "bobinaAT3":7,
  "bobinaRG1":8,
  "bobinaRG2":9,
  "bobinaRG3":10,
  "bobinaRF1":11,
  "bobinaRF2":12,
  "bobinaRF3":13,
  "ensamblajeBobinas":14,
  "corteYPlegadoPYS":15,
  "soldaduraPYS":16,
  "envioPYS":17,
  "nucleo":18,
  "montaje":19,
  "horno":20,
  "cYPTapaCuba":21,
  "tapa":22,
  "radiadoresOPaneles":23,
  "cuba":24,
  "tintasPenetrantes":25,
  "granallado":26,
  "pintura":27,
  "encubado":28,
  "ensayosRef":29,
  "terminacion":30,
  "envioADeposito":31,
  "envioACliente":32
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  
  date:string;
  constructor() { }
//private datePipe: DatePipe
  generateExcel(data){
    
    
    const title = 'AVANCE DE LA PRODUCCION';    
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Avance de la producción',{properties:{defaultColWidth:21}});
    let titleRow = worksheet.addRow([title]);
    
    // Set font, size and style in title row.
    titleRow.font = { name: 'Calibri', size: 20, bold: true };
    titleRow.alignment={horizontal:"center"};
    titleRow.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"fabf8f"},bgColor:{ argb:"fabf8f"}};
    titleRow.border={
      top: {style:'medium'},
      left: {style:'medium'},
      bottom: {style:'medium'},
      right: {style:'medium'}
    }
    
    worksheet.mergeCells(1,1,2,38);
    
    
    // Blank Row
    worksheet.addRow([""]);
    // Blank Row
    worksheet.addRow([""]);
    //Add row with current date
    moment.locale('es');
    this.date=moment().format('D MMMM YYYY, h:mm:ss a');
    let actualizado=worksheet.addRow(['ACTUALIZADO A:  '+this.date]);
    actualizado.font={name: 'Calibri', size: 14, bold: true}
    worksheet.mergeCells(`A${actualizado.number}:C${actualizado.number}`);

    let columnas=worksheet.getRow(6).values = [
      'potencia',
      'oP',
      'rango',
      'oT',
      'cliente',
      'observaciones',
      'documentacion',
      'bobinaBT1',
      'bobinaBT2',
      'bobinaBT3',
      'bobinaAT1',
      'bobinaAT2',
      'bobinaAT3',
      'bobinaRG1',
      'bobinaRG2',
      'bobinaRG3',
      'bobinaRF1',
      'bobinaRF2',
      'bobinaRF3',
      'ensamblajeBobinas',
      'corteYPlegadoPYS',
      'soldaduraPYS',
      'envioPYS',
      'nucleo',
      'montaje',
      'horno',
      'cYPTapaCuba',
      'tapa',
      'radiadoresOPaneles',
      'cuba',
      'tintasPenetrantes',
      'granallado',
      'pintura',
      'encubado',
      'ensayosRef',
      'terminacion',
      'envioADeposito',
      'envioACliente'
    ];

    

    worksheet.getRow(6).eachCell((cell, e) => {
      cell.style={alignment:{vertical:'top',horizontal:'center'}};
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd9d9d9' },
        bgColor: { argb: 'd9d9d9' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
      let colRow=cell.address.split(/([0-9]+)/g);
      worksheet.mergeCells(`${colRow[0]}6:${colRow[0]}7`)
    })
    
    worksheet.pageSetup={fitToPage:true};


    worksheet.columns = [
      {key:'potencia'},
      {key:'oP'},
      {key:'rango'},
      {key:'oT'},
      {key:'Cliente'},
      {key:'observaciones'},
      {key:'documentacion'},
      {key:'bobinaBT1'},
      {key:'bobinaBT2'},
      {key:'bobinaBT3'},
      {key:'bobinaAT1'},
      {key:'bobinaAT2'},
      {key:'bobinaAT3'},
      {key:'bobinaRG1'},
      {key:'bobinaRG2'},
      {key:'bobinaRG3'},
      {key:'bobinaRF1'},
      {key:'bobinaRF2'},
      {key:'bobinaRF3'},
      {key:'ensamblajeBobinas'},
      {key:'corteYPlegadoPYS'},
      {key:'soldaduraPYS'},
      {key:'envioPYS'},
      {key:'nucleo'},
      {key:'montaje'},
      {key:'horno'},
      {key:'cYPTapaCuba'},
      {key:'tapa'},
      {key:'radiadoresOPaneles'},
      {key:'cuba'},
      {key:'tintasPenetrantes'},
      {key:'granallado'},
      {key:'pintura'},
      {key:'encubado'},
      {key:'ensayosRef'},
      {key:'terminacion'},
      {key:'envioADeposito'},
      {key:'envioACliente'}
      ]
    
    
    worksheet.views=[{state: 'frozen', xSplit: 6, ySplit: 0}]
      
    worksheet.addRow([" "]);
    console.log("KEYS",Object.keys(data));
    data.forEach((e,i)=>{
      if((e.hasOwnProperty("group")))
      {
        let periodo=worksheet.addRow([`${e.group}`]);
        
        periodo.fill={type: 'pattern',pattern: 'solid',fgColor:{ argb:"f79646"},bgColor:{ argb:"f79646"}};
        periodo.font={name: 'Calibri', size: 11, bold: true};
        periodo.border={top: { style: 'thin' },bottom:{style:'thin'}};
        
      }
      else{
        let cuenta=0;
        let cuentaCol=7;
        
        worksheet.addRow({
          potencia:e.potencia,
          oP:e.oPe,
          rango:`${e.rangoInicio}/${e.rangoFin}`,
          oT:e.oTe,
          cliente:e.nombreCli,
          observaciones:e.observaciones,
          documentacion:this.dateOrTime(((e.etapa.find(z=>z.idTipoEtapa==1)))),
          bobinaBT1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==2))),
          bobinaBT2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==3))),
          bobinaBT3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==4))),
          bobinaAT1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==5))),
          bobinaAT2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==6))),
          bobinaAT3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==7))),
          bobinaRG1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==8))),
          bobinaRG2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==9))),
          bobinaRG3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==10))),
          bobinaRF1:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==11))),
          bobinaRF2:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==12))),
          bobinaRF3:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==13))),
          ensamblajeBobinas:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==14))),
          corteYPlegadoPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==15))),
          soldaduraPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==16))),
          envioPYS:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==17))),
          nucleo:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==18))),
          montaje:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==19))),
          horno:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==20))),
          cYPTapaCuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==21))),
          tapa:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==22))),
          radiadoresOPaneles:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==23))),
          cuba:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==24))),
          tintasPenetrantes:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==25))),
          granallado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==26))),
          pintura:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==27))),
          encubado:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==28))),
          ensayosRef:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==29))),
          terminacion:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==30))),
          envioADeposito:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==31))),
          envioACliente:this.dateOrTime((e.etapa.find(z=>z.idTipoEtapa==32)))
        }).eachCell({includeEmpty: true},(cell,colNumber)=>{
          
          let colorCortado;
          
          if(colNumber==cuentaCol)
          {
            cuentaCol++;
            cuenta++;
            // console.log(cuenta);
            // console.log(cuentaCol);
            if(cuentaCol<39 && (e.etapa.find(z=>z.idTipoEtapa==cuenta).idColorNavigation)!==null)
            {
              
              colorCortado=(e.etapa.find(z=>z.idTipoEtapa==cuenta).idColorNavigation.codigoColor).replace('#','');
              // console.log(colorCortado);
              cell.fill={
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: `${colorCortado}` },
                bgColor: { argb: `${colorCortado}` }
              }
              // console.log(cell.fill);
            }
          }
          cell.border={top: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' },bottom:{style:'thin'}}
          
          
          // switch(colNumber)
          // {
          //   case 7
          // }
          
        })
      }
    })
    
    // worksheet.mergeCellsWithoutStyle('AM1:AM200')

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AvanceProduccion.xlsx');
    })
  }
  
  dateOrTime(etapa) : string | Date{
    console.log(etapa.dateFin);
    if(etapa.dateFin==null)
    {
        return etapa.tiempoParc;
    }
    else{
        return etapa.dateFin;
    }
}
}
