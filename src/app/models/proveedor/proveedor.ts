import { DetalleProveedor } from './detalleProveedor';

export class Proveedor {
    idProveedor?:        number;
    nombreProveedor?:    string;
    emailProveedor?:     string;
    movilProveedor?:     string;
    telefonoProveedor?:  string;
    rucProveedor?:       string;
    direccionProveedor?: string;
    estadoProveedor?:    boolean;
    detalleProveedor?:   DetalleProveedor;
}

