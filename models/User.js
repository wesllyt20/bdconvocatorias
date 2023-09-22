import mongoose from "mongoose";
import moment from "moment";

import bcrypt from "bcryptjs";
var now = moment();
moment.locale('es');

const userSchema = new mongoose.Schema({
    tipoDocument: {
        type: String,
        required: true,
    },
    numeroDocumento: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        index: { unique: true }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
    },
    nombres: {
        type: String,
        required: true,
    },
    celular: {
        type: Number,
        required: true,
        unique: true,
        default: 999999999
    },
    fotoPerfil: {
        type: String,
        default: 'ruta/de/ejemplo.jpg'
    },
    fechaNacimiento: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return moment(value, 'DD/MM/YYYY', true).isValid();
            },
            message: 'El formato de fecha debe ser dd/MM/yyyy'
        }
    },
    tipoUser: {
        type: String,
        required: true,
        default: 'postulante',
    },
    genero: {
        type: String,
        required: true,
    },
    fechaRegistro: {
        type: String,
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
    postulaciones: [
        {
            nombreConvocatoria: {
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
                default: "APLICADO"
            }
        }
    ],
    contadorPostulaciones: {
        type: Number,
        default: 0
    }
},
    {
        versionKey: false
    });

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Error al codificar la contraseña");
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', function (next) {
    const user = this;
    user.contadorPostulaciones = user.postulaciones.length;
    console.log(user.postulaciones.length)
    next();
});

export const User = mongoose.model("User", userSchema);

