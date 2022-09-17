import { FormaPago } from '../formaPago';
import { Proveedor } from '../proveedor/proveedor';
import { DetalleCompraProducto } from './detalleCompraProducto';
export class Compra{
    idCompra?:       number;
    codigoCompra?:   string;
    fechaCompra?:    Date;
    formaPago?:      FormaPago;
    proveedor?:      Proveedor;
    estadoCompra?:   boolean;
    totalCompra?:    number;
    ivaTotalCompra?: number ;
    ivaCompra?: number ;
	subTotalCompra?: number ;
    items?:        DetalleCompraProducto[];
}
