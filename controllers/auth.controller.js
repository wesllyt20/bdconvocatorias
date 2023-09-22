import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    const { tipoDocument,
        numeroDocumento,
        email,
        password,
        nombres,
        fechaNacimiento,
        celular,
        genero } = req.body;
    try {

        let user = await User.findOne({ email });
        if (user) throw { code: 11000 }

        user = await User.findOne({ numeroDocumento });
        if (user) throw { code: 12000 }

        user = await User.findOne({ celular });
        if (user) throw { code: 13000 }

        user = new User({
            tipoDocument,
            numeroDocumento,
            email,
            password,
            nombres,
            fechaNacimiento,
            celular,
            genero
        });
        await user.save();

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);


        mensajeRegistroOK(user.email);
        return res.status(201).json({ token, expiresIn })
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(400).json({ error: "Correo ya registrado." });
        } else if (error.code === 12000) {
            return res.status(400).json({ error: "Numero de documento ya registrado." });
        } else if (error.code === 13000) {
            return res.status(400).json({ error: "Numero de celular ya registrado." });
        }
        return res.status(500).json({ error: "Error de servidor" });

    }

};

export const forgetPassword = async (req, res) => {

};



const mensajeRegistroOK = async (correoUser) => {
    console.log("veamos")
    const config = {

        service: 'gmail',
        auth: {
            user: 'otidg02@igp.gob.pe',
            pass: process.env.AUTHMSG_TWOTOKEN
        }

    };
    const mensaje = {
        from: 'otidg02@igp.gob.pe',
        to: `${correoUser}`,
        subject: 'Te has registrado correctamente.',
        html: `
        <div style="Width: 744px;Height:742px;top:3px;background-color: white; margin: auto">
        <table style="width:100%; border-collapse:collapse;">
        <tr>
        <td style="text-align:left;">
            <img src="https://ultimosismo.igp.gob.pe/img/logo_minam.png" height="40" style="padding: 0px 4px 0px 0px;">
            <img src="https://ultimosismo.igp.gob.pe/img/logo-igp-normal.png" height="40" style="margin-right: 10px;">
        </td>
        <td style="text-align:right;">
            <h3 style="font-family: 'Poppins', sans-serif;
            font-size: 18px;
            font-weight: 500;
            line-height: 27px;
            letter-spacing: 0em;
            text-align: right;
            color: #0032FF;
            margin-left: 10px;">
            Convocatorias de trabajo <b>IGP</b>
            </h3>
        </td>
        </tr>
        </table>
        <div style="Width: 744px;Height:650px; background-color: rgba(153, 153, 153, 0.1);border-radius: 15px;border-color: #FFFFFF;">
        <h1 style="font-family: 'Poppins', sans-serif;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        color: #0032FF;
        padding: 30px 0px 0px 0px;">¡Bienvenido!</h1> 
        <img src="https://ide.igp.gob.pe/geovisor/isotopicas/identidad.png" style="width: 183px; height: 183px; display: block; margin: auto;" />
        <h1 style="font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 300;
        letter-spacing: 0em;
        text-align: center;
        color: #000000;
        padding: 30px 0px 15px 0px;">¡Hola, <b>${correoUser}</b>!</h1> 
        <p style="font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        color: #000000;
        padding: 0px 0px 15px 0px;
        line-height: 22px">
        El Instituto Geofísico del Perú te da la bienvenida a su plataforma web de 
        <br><b>Convocatorias de Trabajo IGP</b>, ingresa al siguiente enlace para completar 
        <br>los datos de tu registro. 
        </p>
        <button style="color: #fff; width: 263px; height: 43px;  background-color: #0032FF;  display: block; margin: auto;border-radius: 10px;border-color: #FFFFFF;">
            <a
            style="font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        color: #000000;
        padding: 0px 0px 15px 0px;
        line-height: 22px;
        color: #fff;"
            >Ir a mi perfil</a>
        </button>
        <p style="font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        color: #000000;
        padding: 20px 0px 15px 0px;
        line-height: 22px">Atte.
        <br>Unidad de Recursos Humanos
        </p>
        <p  style="font-family: 'Poppins', sans-serif;
        font-size: 10px;
        font-weight: 400;
        letter-spacing: 0em;
        text-align: center;
        color: #000000;
        padding: 0px 0px 15px 0px;
        line-height: 22px">Centro de ayuda de <a  href="mailto:soporteti@igp.gob.pe">soporteti@igp.gob.pe</a></p>
        </div>
        </div>
        
        
        
        
        `,
    };
    const transport = nodemailer.createTransport(config);
    try {
        const info = await transport.sendMail(mensaje);
        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.log('Error al enviar el correo:', error);
    }

};







export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user)
            return res.status(403).json({ error: "Usuario o contraseña incorrecta." })

        const respuestaPassword = await user.comparePassword(password)
        if (!respuestaPassword)
            return res.status(403).json({ error: "Usuario o contraseña incorrecta." })

        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);



        return res.json({ token, expiresIn })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Error de servidor" })

    }
};
export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean()
        return res.json({ email: user.email, uid: user.id })
    } catch (error) {
        return res.status(500).json({ error: "Error de server." })
    }
};

export const refreshToken = (req, res) => {
    try {
        const { token, expiresIn } = generateToken(req.uid);

        return res.json({ token, expiresIn })

    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({ error: "Error de server" })
    }
};

// ACTUALIZAR USUARIO POR ID
export const updateUser = async (req, res) => {
    try {

        const { id } = req.params;
        const { email,
            password,
            celular
        } = req.body;


        let { fotoPerfil } = req.body;

        if (!fotoPerfil || fotoPerfil.trim() === "") {
            fotoPerfil = 'ruta/de/ejemplo.jpg'; // Valor por defecto si no se proporciona fotoPerfil
        }

        const user = await User.findOne(id)

        if (!user) return res.status(404).json({ error: "No existe el usuario" });

        if (!user.uid.equals(req.uid))
            return res.status(401).json({ error: "No le pertenece ese usuario 🤡" });
        user.email = email || user.email;
        user.password = password || user.password;
        user.fotoPerfil = fotoPerfil || user.fotoPerfil;
        user.celular = celular || user.celular;

        const userActualizado = await user.save();
        return res.status(200).json(userActualizado);
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ ok: true })

};