export default function autorizarUsuario( perfilesAutorizados = [] ) {

    return async (req, res, next) => {
        console.log("Entrando a autorizarUsuario");
        const usuario = req.user;
        //console.log(req.user+" autorizarUsuario");
        //console.log(usuario+" autorizarUsuario");
        //console.log(usuario.idTipoUsuario+" autorizarUsuario.js");
        
        if (!usuario || !perfilesAutorizados.includes(usuario.idTipoUsuario)) {
            return res.status(403).json({
                estado: "Falla",
                mesaje: "Acceso denegado."
            });
        }
        next();
    }
};