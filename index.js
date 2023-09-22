import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import linkRoutes from "./routes/link.route.js";
import convocatoriaRoutes from "./routes/convocatoria.route.js";
import postulacionRoutes from "./routes/postulacion.route.js";
import cookieParser from "cookie-parser";
import redirectRouter from "./routes/redirect.router.js"


const app = express();
const whiteList = [process.env.ORIGIN1]
app.use(
    cors({
        origin: function (origin, callback) {
            console.log("😲😲😲 => ¡Operacion Exitosa!,", origin);
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback(
                "Error de CORS origin: " + origin + " No autorizado!"
            );
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", redirectRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/convocatorias", convocatoriaRoutes);
app.use("/api/v1/postulacion", postulacionRoutes);
app.use("/api/v1/links", linkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("😍😍 http://localhost:" + PORT));