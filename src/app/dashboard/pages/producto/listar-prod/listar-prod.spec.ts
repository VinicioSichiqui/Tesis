import { ListarProdComponent } from './listar-prod.component';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../models/producto/producto';
import { EMPTY, from } from 'rxjs';
import { RespuestaServer } from '../../../../models/response';
import { MsgSweetAlertService } from '../../../../services/msg-sweet-alert.service';

describe( 'ListarProdComponent' , () =>{
    let component : ListarProdComponent;
    const servicioProducto = new ProductoService(null!);
    const msg = new MsgSweetAlertService();
    beforeEach( () => {
        component = new ListarProdComponent(servicioProducto,msg);
    });
    
    it( 'init debe cargar los productos ', () => {
        const productos: Producto [] =  [
            {
                idProducto: 1,
                descripcionProducto: "Doritos dinamita",
                codigoProducto: "002",
                imgProducto: "",
                precioVentaProducto: 5.6,
                stockProducto: 50,
                estadoProducto: true,
                menuClienteProducto: false,
                destacarProducto: false,
                marca: {
                    idMarca: 2,
                    nombreMarca: "Doritos"
                },
                presentacion: {
                    idPresentacion: 2,
                    nombrePresentacion: "50gr"
                },
                zona: {
                    idZona: 2,
                    nombreZona: "bodega"
                }
            },
            {
                idProducto: 1,
                descripcionProducto: "Doritos dinamita",
                codigoProducto: "002",
                imgProducto: "",
                precioVentaProducto: 5.6,
                stockProducto: 50,
                estadoProducto: true,
                menuClienteProducto: false,
                destacarProducto: false,
                marca: {
                    idMarca: 2,
                    nombreMarca: "Doritos"
                },
                presentacion: {
                    idPresentacion: 2,
                    nombrePresentacion: "50gr"
                },
                zona: {
                    idZona: 2,
                    nombreZona: "bodega"
                }
            }
        ]

        spyOn( servicioProducto, 'productos').and.callFake( () => {
            let res: RespuestaServer = {
                respuesta: productos,
                mensaje: '',
                ok: false,
                error: undefined
            };
            return from( [ res ]);
        });

        component.ngOnInit();
        expect( component.productos.length) .toBeGreaterThan(0);
    });

    it('Dede de llamar al servidor para actualizar estado de un producto', () => {
        const espia = spyOn( servicioProducto, 'actualizarEstado').and.callFake((producto) => {
            return EMPTY;
        });
        let producto: Producto = {}; 
        component.actualizarEstado(producto);
        expect(espia).toHaveBeenCalled();
    })
});