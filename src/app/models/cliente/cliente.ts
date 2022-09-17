import { TipoCliente } from './tipoCliente';
import { Persona } from '../persona';
export class Cliente{
    idCliente?:             number;
    telefonoCliente?:       string;
    tipoCliente?:           TipoCliente;
    estadoCliente?:         boolean;
    persona?:               Persona;
}