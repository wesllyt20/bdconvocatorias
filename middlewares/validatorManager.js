import { validationResult, body, param } from "express-validator";
import axios from "axios";
import moment from "moment";

export const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
};
// HERRAMIENTAS  ----------
export const paramLinkValidator = [
    param("id", "Formato no valido")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress
];

export const paramNanoLinkValidator = [
    param("nanoLink", "Formato no valido")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress
];

export const bodyPDFValidator =
    [
        body("pdfLink", "Ingrese la descripcion de la convocatoria")
            .matches(/\.(pdf)$/i)
            .withMessage("Formato no autorizado, solo se permite archivo .pdf"),
        validationResultExpress
    ];


// LINK EJEMPLO -------
export const bodyLinkValidator = [
    body("longLink", "formato link incorrecto")
        .trim()
        .notEmpty()
        .custom(async (value) => {
            try {
                if (!value.startsWith("https://")) {
                    value = "https://" + value;
                }
                await axios.get(value);
                return value;
            } catch (error) {
                // console.log(error);
                throw new Error("not found longlink 404");
            }
        }),
    validationResultExpress,
];
// ----------------------------------------

// AUTH ----------------------------
//
// CREATE
export const bodyRegisterValidator =
    [
        body("tipoDocument", "Ingrese su tipo de documento.")
            .isLength({ min: 3 }),
        body("numeroDocumento", "Ingrese su numero de documento.")
            .isLength({ min: 3 })
            .isNumeric()
            .withMessage("El numero de documento debe ser numérico"),
        body("email", "Ingrese un email válido.")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password", "Contraseña mínimo 8 carácteres.")
            .trim()
            .isLength({ min: 8 }),
        body("password", "Formato de contraseña incorrecta.")
            .custom((value, { req }) => {
                if (value !== req.body.repassword) {
                    throw new Error("No coinciden las contraseñas.");
                }
                return value;
            }),

        body("nombres", "Ingrese su nombre completo.")
            .isLength({ min: 10 }),

        body("fechaNacimiento", "Ingrese una fecha válida.")
            .custom((value) => {
                if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
                    throw new Error('Ingrese una fecha válida en formato dd/MM/aaaa.');
                }
                return true;
            }),
        body("celular", "Debe tener mínimo 9 digitos.")
            .trim()
            .isLength({ min: 9, max: 9 })
            .withMessage("Debe tener 9 dígitos.")
            .matches(/^9/)
            .withMessage("Debe comenzar con el número 9."),
        body("genero")
            .trim()
        ,

        validationResultExpress
    ];
// LOGIN
export const bodyLoginValidator = [
    body("email", "Email Incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Contraseña incorrecta")
        .trim(),
    validationResultExpress
];

// UPDATE
export const bodyUserUpdateValidator = [
    body("email", "Ingrese un email válido.")
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("fotoPerfil")
        .optional()
        .matches(/\.(jpg|png)$/i)
        .withMessage("Formato no autorizado, solo se permiten archivos .jpg o .png"),
    body("password", "Contraseña mínimo 8 carácteres.")
        .optional()
        .trim()
        .isLength({ min: 8 }),
    body("password", "Formato de contraseña incorrecta.")
        .optional()
        .custom((value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error("No coinciden las contraseñas.");
            }
            return value;
        }),
    body("celular", "Debe tener mínimo 9 digitos.")
        .optional()
        .trim()
        .isNumeric()
        .isLength({ min: 9 })
        .withMessage("Debe tener mínimo 9 dígitos.")
        .matches(/^9/)
        .withMessage("Debe comenzar con el número 9."),
    validationResultExpress,
];
// ----------------------------------------

// Convocatoria ----------------------------
//
// CREATE
export const bodyCreateConvocatoriaValidator =
    [
        body("nombre", "Ingrese nombre de convocatoria")
            .isLength({ min: 30 }),

        body("tipo", "Ingrese tipo de convocatoria")
            .isLength({ min: 3 }),
        body("tipoContrato", "Ingrese tipo contrato de la convocatoria")
            .isLength({ min: 3 }),

        body("descripcion", "Ingrese la descripcion de la convocatoria")
            .isLength({ min: 30 }),

        body("formacionAcademica", "Ingrese la formacion academica")
            .isLength({ min: 24 }),

        body("bases", "Ingrese la descripcion de la convocatoria")
            .matches(/\.(pdf)$/i)
            .withMessage("Formato no autorizado, solo se permite archivo .pdf"),

        body("subvencion", "Ingrese la subvencion de la convocatoria")
            .isLength({ min: 3 })
            .isNumeric()
            .withMessage("El valor de la subvencion debe ser numérico"),

        body("fechaFinConvocatoria", "Ingrese una fecha válida.")
            .custom((value) => {
                if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
                    throw new Error('Ingrese una fecha válida en formato dd/MM/aaaa.');
                }
                return true;
            }),
        validationResultExpress
    ];

//UPDATE
export const bodyUpdateConvocatoriaValidator =
    [
        body("nombre", "Ingrese nombre de convocatoria")
            .optional()
            .isLength({ min: 30 }),

        body("tipo", "Ingrese tipo de convocatoria")
            .optional()
            .isLength({ min: 3 }),

        body("descripcion", "Ingrese la descripcion de la convocatoria")
            .optional()
            .isLength({ min: 30 }),

        body("formacionAcademica", "Ingrese la formacion academica")
            .optional()
            .isLength({ min: 24 }),

        body("bases", "Ingrese la descripcion de la convocatoria")
            .optional()
            .matches(/\.(pdf)$/i)
            .withMessage("Formato no autorizado, solo se permite archivo .pdf"),

        body("subvencion", "Ingrese la subvencion de la convocatoria")
            .optional()
            .isLength({ min: 3 })
            .isNumeric()
            .withMessage("El valor de la subvencion debe ser numérico"),
        body("estadoConvocatoria", "Ingrese el estado de la convocatoria.")
            .optional()
            .isLength({ min: 3 }),
        body("fechaFinConvocatoria", "Ingrese una fecha válida.")
            .optional()
            .custom((value) => {
                if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
                    throw new Error('Ingrese una fecha válida en formato dd/MM/aaaa.');
                }
                return true;
            }),
        validationResultExpress
    ];
