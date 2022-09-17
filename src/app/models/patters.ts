import { FormControl, ValidationErrors } from '@angular/forms';

export class Patter {
    static emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    static telefonoPattern: string = '^[1-9][0-9]{6,6}$';
    static movilPattern: string = '^[0-0][9-9][0-9]{8}$';
    static phonePattern: string = '^[0-9][0-9]{6,9}$';
    
}