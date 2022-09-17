import { Presentacion } from './presentacion';
import { Zona } from './zona';
import { Marca } from './marca';
export class Producto {
    idProducto?:          number;
    descripcionProducto?: string;
    imgProducto?:         string;
    fechaIngreso?:        Date;
    codigoProducto?:      string;
    ivaProducto?:         number;
    precioVentaProducto?: number;
    estadoProducto?:      boolean;
    stockProducto?:       number;
    menuClienteProducto?: boolean;
    destacarProducto?: boolean;
    marca?:               Marca;
    presentacion?:        Presentacion;
    zona?:                Zona;
}

