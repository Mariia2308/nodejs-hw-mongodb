// src/routers/auth.js
import { Router } from "express";
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/registerUserSchema.js";
import { registerUserController, loginUserController, logoutUserController, refreshTokenController, sendResetEmailController,sendResetPasswordController } from "../controllers/auth.js";
import { loginUserSchema,  } from "../validation/loginUserSchema.js";
import { sendResetEmailSchema } from "../validation/sendResetEmailSchema.js";
import { sendResetPasswordSchema } from "../validation/sendResetPasswordSchema.js";


const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', ctrlWrapper(loginUserController), validateBody(loginUserSchema));
authRouter.post('/refresh', ctrlWrapper(refreshTokenController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/send-reset-email', ctrlWrapper(sendResetEmailController), validateBody(sendResetEmailSchema));
authRouter.post('/reset-pwd', ctrlWrapper(sendResetPasswordController), validateBody(sendResetPasswordSchema));


export default authRouter;