import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { Producto } from '../../models/producto/producto';

@Injectable({
  providedIn: 'root'
})
export class ReporProductoService {

  constructor() { }

  generarPdf = (productos: Producto[], fechaInicio?: Date, fechaFin?: Date, termino?: string) => {
    const doc = new jsPDF();
    doc.addImage('../../../../../assets/img/logo_app.jpeg', "JPEG", 85, 0, 45, 40);
    doc.setFontSize(22);
    doc.text('Reporte de productos', 110, 45, {align: 'center'});
    doc.setFontSize(12);
    if ( fechaInicio && fechaFin ) {
      let stritgFechaInicio = formatDate(fechaInicio, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      let stritgFechaFin = formatDate(fechaFin, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      doc.text(`Parámetros de búsqueda: Desde ${stritgFechaInicio} hasta ${stritgFechaFin}`, 15, 55);
    } else if ( termino ) {
      doc.text(`Lista de productos con el término: ${termino}`, 15, 55);
    } else {
      doc.text(`Lista de todos los productos existentes`, 15, 55);
    }
    autoTable(doc, {
      startY: 60,
      head: [[ 'Código', 'Nombre', 'Fecha', 'Precio', 'Stock']],
      body: this.dataInput(productos),
    });
    doc.save('table.pdf')
  }

  dataInput = (productos: Producto[]): RowInput[] => {
    let data: RowInput [] = [];
    for (const desc of productos) {
      data.push([ desc.codigoProducto!, desc.descripcionProducto!, desc.fechaIngreso?.toString()!, (`$${desc.precioVentaProducto!}`), desc.stockProducto!])
    }
    return data;
  }
}
