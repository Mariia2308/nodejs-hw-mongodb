import { Router } from "express";
import authRouter from "./auth.js";
import contactRouter from "./contacts.js";

const rootRouter = Router();
rootRouter.use('/auth', authRouter);
rootRouter.use('/contacts', contactRouter);
export default rootRouter;