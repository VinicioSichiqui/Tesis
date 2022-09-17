import { Producto } from '../producto/producto';
export class DetalleCompraProducto{
    idDetalleCompraProducto?:         number;
    cantidadDetalleCompraProducto?:   number;
    precioDetalleCompraProducto?:     number;
    totalDetalleCompraProducto?:      number;
    ivaDetalleCompraProducto?:        number;
    producto?:                        Producto;
}