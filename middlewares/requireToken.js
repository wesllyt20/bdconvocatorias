import jwt from "jsonwebtoken"
import { tokenVerificationErrors } from "../utils/tokenManager.js"
export const requireToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;

        if (!token)
            throw new Error("No Bearer")

        token = token.split(" ")[1];
        const { uid } = jwt.verify(token, process.env.JWT_SECRET)

        req.uid = uid;
        next();
    } catch (error) {

        return res
            .status(401)
            .json(error.message);
            //.send({ error: tokenVerificationErrors[error.message] })
    }
};