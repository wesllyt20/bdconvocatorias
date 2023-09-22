import { Router } from "express";
import {
    createConvocatoria,
    updateConvocatoria,
    getAllConvocatoria,
    getOneConvocatoria,
    removeConvocatoria,
    createComunicado,
    updateComunicado,
    removeComunicado,
    createResultado,
    updateResultado,
    removeResultado
} from "../controllers/convocatoria.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
    paramLinkValidator,
    paramNanoLinkValidator,
    bodyPDFValidator,
    bodyCreateConvocatoriaValidator,
    bodyUpdateConvocatoriaValidator,
} from "../middlewares/validatorManager.js";

const router = Router();
// CONVOCATORIAS
router.post("/crear",
    requireToken,
    bodyCreateConvocatoriaValidator,
    createConvocatoria); // CREAR

router.get("/", getAllConvocatoria); // LISTART TODO
router.get("/:nanoLink", paramNanoLinkValidator, getOneConvocatoria); // LISTART UNO

router.patch("/:nanoLink",
    requireToken,
    paramNanoLinkValidator,
    bodyUpdateConvocatoriaValidator,
    updateConvocatoria); // ACTUALIZAR

router.delete("/:nanoLink", requireToken, paramNanoLinkValidator, removeConvocatoria);// ELIMINAR

// RESULTADOS
router.post("/:nanoLink/resultado",
    requireToken,
    paramNanoLinkValidator,
    bodyPDFValidator,
    createResultado); //CREAR
router.patch("/resultado/:id",
    requireToken,
    paramLinkValidator,
    bodyPDFValidator,
    updateResultado); // ACTUALIZAR
router.delete("/resultado/:id/",
    requireToken,
    paramLinkValidator,
    removeResultado); // BORRAR


// COMUNICADOS
router.post("/:nanoLink/comunicado",
    requireToken,
    paramNanoLinkValidator,
    bodyPDFValidator,
    createComunicado); // CREAR

router.patch("/comunicado/:id",
    requireToken,
    paramLinkValidator,
    bodyPDFValidator,
    updateComunicado); // ACTUALIZAR

router.delete("/comunicado/:id/",
    requireToken,
    paramLinkValidator,
    removeComunicado); // BORRAR

/*router.post("/login", bodyLoginValidator, login);
router.get("/protected", requireToken, infoUser);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get('/logout', logout)*/


export default router;