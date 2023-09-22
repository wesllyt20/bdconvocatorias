import mongoose from "mongoose";
import moment from "moment";

var now = moment();
moment.locale('es');

const anexo2aSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    Ape_nomb: {},

    fechaNacimiento: {
        type: String,
        required: true,
        default: () => moment().format("DD/MM/YYYY")
    },
    direccion: {
        type: String,
        required: true,
    },
    urbanizacion: {
        type: String,
        required: true,
    },
    distrito: {
        type: String,
        required: true,
    },
    dni: {
        type: Number,
        required: true,
    },
    nRuc: {
        type: Number,
        required: true,
    },
    telFijo: {
        type: Number,
        required: true,
    },
    telCelu: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
});
export const Anexo2A = mongoose.model("Anexo2a", anexo2aSchema);



const anexo2bSchema = new mongoose.Schema({
    desripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true,
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },

});
export const Anexo2B = mongoose.model("Anexo2b", anexo2bSchema);


const anexo3Schema = new mongoose.Schema({
    desripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true,
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
});
export const Anexo3 = mongoose.model("Anexo3", anexo3Schema);



const anexo4Schema = new mongoose.Schema({
    desripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true,
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
});
export const Anexo4 = mongoose.model("Anexo4", anexo4Schema);





