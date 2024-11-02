import express from "express";
import ReclamosControlador from "../../controladores/reclamosControlador.js";

const router = express.Router();

const reclamosControlador = new ReclamosControlador();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reclamo:
 *       type: object
 *       properties:
 *         idReclamo:
 *           type: integer
 *           description: ID del reclamo
 *         asunto:
 *           type: string
 *           description: Asunto del reclamo
 *         descripcion:
 *           type: string
 *           description: descripcion del reclamo
 *         fechaCreado:
 *           type: string
 *           format: date-time
 *           description: fecha-hora de creación del reclamo. 
 *         fechaFinalizado:
 *           type: string
 *           format: date-time
 *           description: fecha hora de finalización del reclamo. 
 *         fechaCancelado:
 *           type: string
 *           format: date-time
 *           description: fecha hora de cancelación del reclamo. 
 *         idReclamoEstado:
 *           type: number
 *           description: ID del estado del reclamo
 *         idReclamoTipo:
 *           type: number
 *           description: ID del tipo del reclamo
 *         idUsuarioCreador:
 *           type: number
 *           description: ID del usuario creador del reclamo
 *         idUsuarioFinalizador:
 *           type: number
 *           description: ID del usuario finalizador del reclamo
 */


router.post("/", reclamosControlador.crear); //solo cliente?

/**
 * @swagger
 * /api/v1/reclamos:
 *  get:
 *      summary: Obtiene una lista de todos los reclamos
 *      tags: [Reclamos]
 *      responses:
 *          200:
 *           description: Lista de reclamos
 *           content:
 *            application/json:
 *             schema:
 *              type: array
 *              items:
 *               $ref: '#/components/schemas/Reclamo'
 */
router.get("/", reclamosControlador.buscarTodos);

/**
 * @swagger
 * /api/v1/reclamos/idReclamo:
 *  get:
 *      summary: Obtiene un reclamo por su id
 *      tags: [Reclamos]
 *      responses:
 *          200:
 *           description: Un unico reclamo
 *           content:
 *            application/json:
 *             schema:
 *              type: object
 *              items:
 *               $ref: '#/components/schemas/Reclamo'
 */
router.get("/:idReclamo", reclamosControlador.buscarPorId);


router.put("/:idReclamo", reclamosControlador.actualizar);


router.delete("/:idReclamo", reclamosControlador.eliminar);


router.post('/atencion/:idReclamo', reclamosControlador.atenderReclamo); //deberia ser accesible para empleado


router.post('/cancelar/:idReclamo', reclamosControlador.cancelarReclamo); //esta deberia ser accesible solo para el cliente


/*
router.patch("/:idReclamo", reclamosControlador.actualizarParcialmente);
*/

export { router };