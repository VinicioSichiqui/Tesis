import { Injectable } from '@angular/core';
import { Venta } from '../../models/venta/venta';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable, { RowInput } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ReporVentaService {

  constructor() { }

  generarPdf = (ventas: Venta[], fechaInicio?: Date, fechaFin?: Date, termino?: string) => {
    const doc = new jsPDF();
    doc.addImage('../../../../../assets/img/logo_app.jpeg', "JPEG", 85, 0, 45, 40);
    doc.setFontSize(22);
    doc.text('Reporte de ventas', 110, 45, {align: 'center'});
    doc.setFontSize(12);
    if ( fechaInicio && fechaFin ) {
      let stritgFechaInicio = formatDate(fechaInicio, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      let stritgFechaFin = formatDate(fechaFin, 'YYYY-MM-dd', 'es-EC').toUpperCase();
      doc.text(`Parámetros de búsqueda: Desde ${stritgFechaInicio} hasta ${stritgFechaFin}`, 15, 55);
    } else if ( termino ) {
      doc.text(`Lista de ventas por cliente según la cédula: ${termino}`, 15, 55);
    } else {
      doc.text(`Lista de todas las ventas existentes.`, 15, 55);
    }
    autoTable(doc, {
      startY: 60,
      head: [[ 'Código', 'Nombres', 'Apellidos', 'Cédula', 'Fecha', 'Total Venta']],
      body: this.dataInput(ventas),
    });
    doc.save('table.pdf')
  }

  dataInput = (ventas: Venta[]): RowInput[] => {
    let data: RowInput [] = [];
    for (const desc of ventas) {
      let nombres = desc.cliente?.persona?.nombresPersona?.toUpperCase();
      let apellidos = desc.cliente?.persona?.apellidosPersona?.toUpperCase();
      let cedula = desc.cliente?.persona?.cedulaPersona?.toUpperCase();
      data.push([ desc.codigoVenta!, nombres!, apellidos!, cedula!, desc.fechaVenta?.toString()!, (`$${desc.totalVenta!}`)])
    }
    return data;
  }
}
