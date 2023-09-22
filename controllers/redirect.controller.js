import { Convocatoria } from "../models/Convocatoria.js";

export const redirectLink = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const convocatoria = await Convocatoria.findOne({ nanoLink });

        if (!convocatoria) return res.status(404).json({ error: "No existe el link" });
        console.log(convocatoria)

        return res.json(convocatoria);
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};
//  LINK PARA VER DE MANERA PUBLICA