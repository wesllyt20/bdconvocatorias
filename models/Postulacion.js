import mongoose from "mongoose";
const { Schema, model } = mongoose;
import moment from "moment";


var now = moment();
moment.locale('es');

const postulacionSchema = new mongoose.Schema({
    nanoLink: { // 10 DIGITOS
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    nombreConvocatoria: {
        type: String,
        required: true,
    },
    numeroDocumento: {
        type: Number,
        required: true,
    },
    nombrePostulante: {
        type: String,
        required: true,
    },
    fechaPostulacion: {
        type: String,
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
    estadoPostulante: {
        type: String,
        required: true,
        default: "APLICADO" // Postulado - CV Visto - Finalista - Proceso finalizado
    }

},
    {
        versionKey: false
    });

export const Postulacion = model("Postulacion", postulacionSchema);