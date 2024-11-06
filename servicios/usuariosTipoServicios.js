import UsuariosTpoBD from "../bd/usuariosTipoBD.js";


export default class UsuariosTipoServicios {
    constructor(){
        this.usuariosTipoBD= new UsuariosTipoBD();
    }
 // La conexión a la base de datos
    

    // Crear un nuevo tipo de usuario
    crear=(usuariosTpo)=>{
        return this.usuariosTipoBD.crear(usuariosTpo);
    };
    
    // Buscar todos los tipos de usuario
    buscarTodos=()=>{
        return this.usuariosTipoBD.buscarTodos();
    };
    

    // Obtener un tipo de usuario por ID
    buscarPorId=(idUsuarioTipo)=>{
        return this.usuariosTipoBD.buscarPorId(idUsuarioTipo);
    };
    

    // Actualizar un tipo de usuario

    actualizar=(idUsuarioTpo, datos)=>{
        return this.usuariosTpoBD.actualizar(idUsuarioTpo, datos);
    };
    

    // Eliminar un tipo de usuario

    eliminar=(idUsuarioTipo)=>{
        return this.usuariosTipoBD.eliminar(idUsuarioTipo);
    };
    
} 