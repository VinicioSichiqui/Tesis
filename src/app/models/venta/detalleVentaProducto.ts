import { Producto } from '../producto/producto';
export class DetalleVentaProducto{
    idDetalleVentaPro?:               number;
    cantidadDetalleProductoVenta?:    number;
    precioDetalleProductoVenta?:      number;
    totalDetalleProductoVenta?:       number;
    producto?:                        Producto;
}