import { Router } from "express";
import { login, register, infoUser, refreshToken, updateUser, logout } from "../controllers/auth.controller.js";
import { requireRefreshToken } from "../middlewares/requireRefresh.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
    bodyLoginValidator,
    bodyRegisterValidator,
    paramLinkValidator,
    bodyUserUpdateValidator
} from "../middlewares/validatorManager.js";

const router = Router();

router.post(
    "/register",
    bodyRegisterValidator,
    register);
router.post("/login", bodyLoginValidator, login);
router.get("/protected", requireToken, infoUser);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get('/logout', logout)
router.patch("/:id", requireToken, paramLinkValidator, bodyUserUpdateValidator, updateUser)


export default router;