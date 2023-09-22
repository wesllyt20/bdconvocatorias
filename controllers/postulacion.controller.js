import { nanoid } from "nanoid";
import { Convocatoria } from "../models/Convocatoria.js";
import { Postulacion } from "../models/Postulacion.js";
import { User } from "../models/User.js";

// POSTULACION
export const createPostulacion = async (req, res) => {

    try {
        const { nanoLink } = req.params;

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });


        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const dniUser = usuario.numeroDocumento;
        const nombreUser = usuario.nombres;

        const dniExistenteConv = convocatoria.postulantes.some((postulante) => postulante.numeroDocumento === dniUser);

        if (dniExistenteConv) {
            return res.status(400).json({ error: "Usted ya postulo a esta convocatoria." });
        }


        // DATA POSTULACION
        const nuevaPostulacion = new Postulacion({
            nanoLink: nanoid(10),
            numeroDocumento: dniUser,
            nombrePostulante: nombreUser,
            nombreConvocatoria: convocatoria.nombre
        });

        console.log(nuevaPostulacion)


        // PARA POSTULACION
        await nuevaPostulacion.save();

        // PARA CONVOCATORIA
        convocatoria.postulantes.push(nuevaPostulacion);
        await convocatoria.save();

        // PARA USER
        usuario.postulaciones.push(nuevaPostulacion);
        await usuario.save();


        return res.status(201).json({ message: "Se registro exitosamente la postulacion." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// UPDATE
export const updatePostulacion = async (req, res) => {
    try {

        const { nanoLink } = req.params;
        const { estadoPostulante, id } = req.body;


        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });

        const postulacion = await Postulacion.findById(id);

        if (!postulacion) return res.status(404).json({ error: "No existe esta postulacion." });

        const postulacionIndex = convocatoria.postulantes.findIndex(result => result._id.toString() === id);

        if (postulacionIndex === -1) {
            return res.status(404).json({ error: "La postulacion no pertenece a esta convocatoria" });
        }

        const nuevaPostulacion = {
            _id: postulacion._id,
            numeroDocumento: postulacion.numeroDocumento,
            nombrePostulante: postulacion.nombrePostulante,
            nombreConvocatoria: postulacion.nombreConvocatoria,
            estadoPostulante: estadoPostulante
        };

        convocatoria.postulantes[postulacionIndex] = nuevaPostulacion;
        usuario.postulaciones[postulacionIndex] = nuevaPostulacion;




        postulacion.estadoPostulante = estadoPostulante
        await postulacion.save();
        await convocatoria.save();
        await usuario.save();

        return res.status(200).json({ message: "Resultado actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};

// VER TOTAL DE POSTULANTES POR CONVOCATORIAS  
export const getPostulanciones_By_Convocatorias = async (req, res) => {
    try {

        const { nanoLink } = req.params;

        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });





        return res.status(200).json(convocatoria.postulantes);
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};
