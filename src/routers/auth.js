// src/routers/auth.js
import { Router } from "express";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { loginUserController,  registerUserController } from "../controllers/auth.js"; 
import { validateBody } from "../middlewares/validateBody.js"; 
import { registerUserSchema } from "../validations/registerUserSchema.js";
import { loginUserSchema } from "../validations/loginSchema.js";
import { RefreshTokenController } from "../controllers/auth.js";
import { logoutUserController } from "../controllers/auth.js";



const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', ctrlWrapper(loginUserController), validateBody(loginUserSchema));
authRouter.post('/reset-token', ctrlWrapper(RefreshTokenController), validateBody());
authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
