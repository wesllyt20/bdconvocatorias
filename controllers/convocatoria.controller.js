import { nanoid } from "nanoid";
import { Convocatoria, Resultado, Comunicado } from "../models/Convocatoria.js";
import { User } from "../models/User.js";


// CONVOCATORIA  -------------------------------------
//
// CREATE
export const createConvocatoria = async (req, res) => {

    const usuarioId = req.uid;
    const usuario = await User.findById(usuarioId);
    const tipoUser = usuario.tipoUser;
    const nombreUser = usuario.nombres;

    if (tipoUser !== "administrador")
        return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

    const {
        nombre,
        tipo,
        tipoContrato,
        descripcion,
        formacionAcademica,
        anexos,
        bases,
        subvencion,
        fechaFinConvocatoria } = req.body;

    try {

        const convocatoriaExistente = await Convocatoria.findOne({ nombre, tipo });

        if (convocatoriaExistente)
            return res.status(400).json({
                error: "Ya existe la " + nombre + " en " + tipo + "."
            });

        const convocatoria = new Convocatoria({
            nanoLink: nanoid(8),
            publicador: nombreUser,
            nombre,
            tipo,
            tipoContrato,
            descripcion,
            formacionAcademica,
            anexos,
            bases,
            subvencion,
            fechaFinConvocatoria
        });
        await convocatoria.save();

        return res.status(201).json({ message: "Convocatoria creada exitosamente." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" });

    }
};

// LIST ALL
export const getAllConvocatoria = async (req, res) => {
    try {
        const convocatoria = await Convocatoria.find({ uid: req.uid })

        return res.json({ convocatoria });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error de servidor" });
    }
};
// LIST ONE
export const getOneConvocatoria = async (req, res) => {
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

// UPDATE
export const updateConvocatoria = async (req, res) => {

    const { nanoLink } = req.params;

    const convocatoria = await Convocatoria.findOne({ nanoLink });
    if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });

    const usuarioId = req.uid;
    const usuario = await User.findById(usuarioId);
    const tipoUser = usuario.tipoUser;
    const nombreUser = usuario.nombres;

    if (tipoUser !== "administrador")
        return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

    try {
        const {
            nombre,
            tipo,
            descripcion,
            formacionAcademica,
            anexos,
            estadoConvocatoria,
            bases,
            subvencion,
            fechaFinConvocatoria } = req.body;

        const convocatoriaExistente = await Convocatoria.findOne({ nombre, tipo });

        if (convocatoriaExistente)
            return res.status(400).json({
                error: "Ya existe la " + nombre + " en " + tipo + "."
            });

        convocatoria.nombre = nombre || convocatoria.nombre;
        convocatoria.publicador = nombreUser;
        convocatoria.tipo = tipo || convocatoria.tipo;
        convocatoria.descripcion = descripcion || convocatoria.descripcion;
        convocatoria.formacionAcademica = formacionAcademica || convocatoria.formacionAcademica;
        convocatoria.estadoConvocatoria = estadoConvocatoria || convocatoria.estadoConvocatoria;
        convocatoria.bases = bases || convocatoria.bases;
        convocatoria.anexos = anexos || convocatoria.anexos;
        convocatoria.subvencion = subvencion || convocatoria.subvencion;
        convocatoria.fechaFinConvocatoria = fechaFinConvocatoria || convocatoria.fechaFinConvocatoria;

        await convocatoria.save();
        return res.status(200).json({ message: "Convocatoria actualizada con exito." });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" });

    }
};

// DELETE
export const removeConvocatoria = async (req, res) => {
    try {
        const { nanoLink } = req.params;

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });



        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });


        await convocatoria.deleteOne();

        return res.json({ message: "Convocatoria borrada con extio" });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" })
        }
        return res.status(500).json({ error: "Error de servidor" });
    }
};


// RESULTADOS -------------------------------------
//
// CREATE
export const createResultado = async (req, res) => {

    try {
        const { nanoLink } = req.params;
        const convocatoria = await Convocatoria.findOne({ nanoLink });
        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });

        const { pdfLink, tipo } = req.body;

        const tipoExistente = convocatoria.resultados.some((resultado) => resultado.tipo === tipo);
        if (tipoExistente) {
            return res.status(400).json({ error: "Este tipo de resultado ya está publicado en la convocatoria." });
        }

        const nuevoResultado = new Resultado({
            pdfLink,
            tipo
        });

        await nuevoResultado.save();
        convocatoria.resultados.push(nuevoResultado);
        await convocatoria.save();
        return res.status(201).json({ message: "Resultado creado con exito." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// UPDATE
export const updateResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, pdfLink, nanoLink } = req.body;
        const resultado = await Resultado.findById(id);
        if (!resultado) return res.status(404).json({ error: "No existe este resultado." });

        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });

        const resultadoIndex = convocatoria.resultados.findIndex(result => result._id.toString() === id);

        if (resultadoIndex === -1) {
            return res.status(404).json({ error: "El resultado no pertenece a esta convocatoria" });
        }

        const nuevoResultado = {
            _id: id,
            tipo: tipo,
            pdfLink: pdfLink,
        };
        convocatoria.resultados[resultadoIndex] = nuevoResultado;

        resultado.pdfLink = pdfLink
        await resultado.save();
        await convocatoria.save();

        return res.status(200).json({ message: "Resultado actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};

//DELETE
export const removeResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nanoLink } = req.body;

        const resultado = await Resultado.findById(id);

        if (!resultado) return res.status(404).json({ error: "No existe este resultado." });

        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });


        const resultadoIndex = convocatoria.resultados.findIndex(result => result._id.toString() === id);

        if (resultadoIndex === -1)
            return res.status(404).json({ error: "El resultado no pertenece a esta convocatoria" });

        convocatoria.resultados.splice(resultadoIndex, 1);
        await convocatoria.save();

        await resultado.deleteOne();

        return res.json({ message: "Resultado borrado con exito." });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" })
        }
        return res.status(500).json({ error: "Error de servidor" });
    }
};


// COMUNICADOS -------------------------------------
//
// CREATE 
export const createComunicado = async (req, res) => {

    try {
        const { nanoLink } = req.params;
        const convocatoria = await Convocatoria.findOne({ nanoLink });
        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });

        const { nombre, pdfLink } = req.body;

        const nombrexistente = convocatoria.comunicados.some((comunicado) => comunicado.nombre === nombre);
        if (nombrexistente) {
            return res.status(400).json({ error: "Este comunicado ya está publicado en la convocatoria." });
        }
        const nuevoComunicado = new Comunicado({
            nombre,
            pdfLink
        });
        await nuevoComunicado.save();
        convocatoria.comunicados.push(nuevoComunicado);
        await convocatoria.save();
        return res.status(201).json({ message: "Comunicado creado exitosamente" });;
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// UPDATE
export const updateComunicado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, pdfLink, nanoLink } = req.body;

        const comunicado = await Comunicado.findById(id);

        if (!comunicado) return res.status(404).json({ error: "No existe este comunicado." });

        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada." });

        const comunicadoIndex = convocatoria.comunicados.findIndex(result => result._id.toString() === id);

        if (comunicadoIndex === -1) {
            return res.status(404).json({ error: "El comunicado no pertenece a esta convocatoria" });
        }

        const nuevoComunicado = {
            _id: id,
            nombre: nombre,
            pdfLink: pdfLink,
        };

        convocatoria.comunicados[comunicadoIndex] = nuevoComunicado;

        comunicado.pdfLink = pdfLink
        await comunicado.save();
        await convocatoria.save();

        return res.status(200).json({ message: "Comunicado actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};

//DELETE
export const removeComunicado = async (req, res) => {
    try {
        const { id } = req.params;
        const { nanoLink } = req.body;

        const comunicado = await Comunicado.findById(id);

        if (!comunicado) return res.status(404).json({ error: "No existe este comunicado." });

        const usuarioId = req.uid;
        const usuario = await User.findById(usuarioId);
        const tipoUser = usuario.tipoUser;

        if (tipoUser !== "administrador")
            return res.status(401).json({ error: "No tienes permisos para esta funcion. 🤡" });

        const convocatoria = await Convocatoria.findOne({ nanoLink });
        if (!convocatoria) return res.status(404).json({ error: "La convocatoria no fue encontrada" });


        const comunicadoIndex = convocatoria.comunicados.findIndex(result => result._id.toString() === id);

        if (comunicadoIndex === -1)
            return res.status(404).json({ error: "El comunicado no pertenece a esta convocatoria" });

        convocatoria.comunicados.splice(comunicadoIndex, 1);
        await convocatoria.save();

        await comunicado.deleteOne();

        return res.json({ message: "Comunicado borrado con exito" });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" })
        }
        return res.status(500).json({ error: "Error de servidor" });
    }
};

