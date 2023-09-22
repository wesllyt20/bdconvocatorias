import { Router } from "express"
import {
    createPostulacion,
    updatePostulacion,
    getPostulanciones_By_Convocatorias
} from "../controllers/postulacion.controller.js";
import { requireToken } from "../middlewares/requireToken.js"



//import { bodyPostulanteUpdateValidator, paramLinkValidator } from "../middlewares/validatorManager.js";
const router = Router();
router.post('/postular/:nanoLink', requireToken, createPostulacion)
router.patch('/calificar/:nanoLink', requireToken, updatePostulacion)
router.get('/:nanoLink/postulantes', requireToken, getPostulanciones_By_Convocatorias)

/*
router.get("/", requireToken, getLinks);
router.get("/:nanoLink", getLink);
router.delete("/:id", requireToken, paramLinkValidator, removeLink);
*/
//router.patch("/:nanoLink", requireToken, paramLinkValidator, bodyPostulanteUpdateValidator, updatePostulante)

export default router;
