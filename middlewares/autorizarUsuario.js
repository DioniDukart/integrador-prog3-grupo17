export default function autorizarUsuario(perfilesAutorizados = []) {

    return (req, res, next) => {

        const usuario = req.user;

        if (!usuario || !perfilesAutorizados.includes(usuario.idUsuarioTipo)) {
            return res.status(403).json({
                estado: "Falla",
                mesaje: "Acceso denegado."
            })
        }

        next();
    }
};