import mongoose from "mongoose";
import moment from "moment";
const { Schema, model, module } = mongoose
var now = moment();
moment.locale('es');

const comunicadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    pdfLink: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    });
export const Comunicado = mongoose.model("Comunicado", comunicadoSchema);

const resultadoSchema = new mongoose.Schema({
    pdfLink: {
        type: String,
        required: true
    },
    //Resultado ficha postulacion y curriculum, evaluacion de conocimiento y resultado final
    tipo: {
        type: String,
        required: true
    }
},
    {
        versionKey: false
    }

);
export const Resultado = mongoose.model("Resultado", resultadoSchema);

const convocatoriaSchema = new mongoose.Schema({
    nanoLink: { //8 digitos
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    tipoContrato: {
        type: String,
        required: true,
    },
    publicador: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    bases: {
        type: String,
        required: true,
        default: 'ruta/de/ejemplo.pdf'
    },
    comunicados: [
        {
            nombre: {
                type: String,
            },
            pdfLink: {
                type: String,
            },
            fechaComunicado: {
                type: String,
                required: true,
                default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
            }
        }
    ],
    resultados: [
        {
            pdfLink: {
                type: String,
            },
            tipo: {
                type: String,
            },
            fechaComunicado: {
                type: String,
                required: true,
                default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
            }
        }
    ],
    subvencion: {
        type: Number,
        required: true,
    },
    formacionAcademica: {
        type: String,
        required: true,
    },
    anexos:
    {
        anexo2a: {
            type: Boolean,
            required: true,
            default: false
        },
        anexo2b: {
            type: Boolean,
            required: true,
            default: false
        },
        anexo3: {
            type: Boolean,
            required: true,
            default: false
        },
        anexo4: {
            type: Boolean,
            required: true,
            default: false
        },
        anexo5: {
            type: Boolean,
            required: true,
            default: false
        }
    }
    ,
    estadoConvocatoria: {
        type: String,
        required: true,
        default: "En proceso"
    },
    fechaInicioConvocatoria: {
        type: String,
        default: () => moment().format("DD/MM/YYYY")
    },
    fechaFinConvocatoria: {
        type: String,
        required: true,
    },
    postulantes:
        [
            {
                numeroDocumento: {
                    type: Number,
                    required: true,
                },
                nombrePostulante: {
                    type: String,
                },
                fechaPostulacion: {
                    type: String,
                    default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
                },
                estadoPostulante: {
                    type: String,
                    required: true,
                    default: "APLICADO"
                }
            }
        ]
},
    {
        versionKey: false
    });

export const Convocatoria = mongoose.model("Convocatoria", convocatoriaSchema);

