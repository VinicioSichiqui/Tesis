import { Injectable } from '@angular/core';
import { Compra } from '../../models/compra/compra';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable, { RowInput } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReporCompraService {

  generarPdf = (compras: Compra[], fechaInicio?: Date, fechaFin?: Date, termino?: string) => {
    const doc = new jsPDF();
    doc.addImage('../../../../../assets/img/logo_app.jpeg', "JPEG", 85, 0, 45, 40);
    doc.setFontSize(22);
    doc.text('Reporte de compras', 110, 45, {align: 'center'});
    doc.setFontSize(12);
    if ( fechaInicio && fechaFin ) {
      let stritgFechaInicio = formatDate(fechaInicio, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      let stritgFechaFin = formatDate(fechaFin, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      doc.text(`Parámetros de búsqueda: Desde ${stritgFechaInicio} hasta ${stritgFechaFin}`, 15, 55);
    } else if ( termino ) {
      doc.text(`Lista de compras por proveedor según la RUC/CI: ${termino}`, 15, 55);
    } else {
      doc.text(`Lista de todas las compras existentes.`, 15, 55);
    }
    autoTable(doc, {
      startY: 60,
      head: [[ 'Código', 'Proveedor', 'RUC/CI', 'Fecha',  'SubTotal', 'IVA', 'Total' ]],
      body: this.dataInput(compras),
    });
    doc.save('table.pdf')
  }

  dataInput = (compras: Compra[]): RowInput[] => {
    let data: RowInput [] = [];
    for (const desc of compras) {
      data.push([ desc.codigoCompra!, desc.proveedor?.nombreProveedor!,  desc.proveedor?.rucProveedor!, desc.fechaCompra?.toString()!, (`$${desc.subTotalCompra!}`), (`$${desc.ivaTotalCompra!}`), (`$${desc.totalCompra!}`)])
    }
    return data;
  }
}
