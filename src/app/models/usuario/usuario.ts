import { Persona } from '../persona';
import { Rol } from './rol';
export class Usuario {
    idUsuario?:       number;
    passwordUsuario?: string;
    anteriorPassword?: string;
    estadoUsuario?:   boolean;
    persona?:         Persona;
    roles?:           string [] = [];
}
