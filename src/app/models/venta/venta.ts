import { FormaPago } from '../formaPago';
import { Cliente } from '../cliente/cliente';
import { DetalleVentaProducto } from './detalleVentaProducto';

export class Venta{
    idVenta?:        number;
    codigoVenta?:    string;
    totalVenta?:     number;
    estadoVenta?:    boolean;
    fechaVenta?:     Date;
    formaPago?:      FormaPago;
    cliente?:        Cliente;
    items?:          DetalleVentaProducto[];

}