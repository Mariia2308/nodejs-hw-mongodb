// src/controllers/auth.js
import { createUser } from "../services/auth.js"; 
import { loginUser } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import { refreshSession } from "../services/auth.js";

const setupSessionCookies = (res, session) => { 
        res.cookie('sessionId', session._id,
    {
        httpOnly: true,
        expire:  7 * 24 * 60 * 1000,
        });
    res.cookie('sessionToken', session.refreshToken,
    {
        httpOnly: true,
        expire: 7 * 24 * 60 * 1000,
     });
};

export const registerUserController = async (req, res) => { 
    const user = await createUser(req.body);
    res.json({
        status: 200,
        message: 'Successfully created user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => { 
    const session = await loginUser(req.body);
    setupSessionCookies(res, session);
    res.json({
        status: 200,
        message: 'Successfully logged user!',
        data: {
            accessToken: session.accessToken},
    });
};



export const RefreshTokenController = async (req, res) => { 
    const { sessionId, sessionToken } = req.cookies;
    const session = await refreshSession(sessionId, sessionToken);
    setupSessionCookies(res, session);
    res.json({
        status: 200,
        message: 'Token refreshed !',
        data: {
            accessToken: session.accessToken},
    });
};




export const logoutUserController = async (req, res) => { 
    await logoutUser({
        sessionId: req.cookies.sessionId,
        sessionToken: req.cookies.sessionToken
    });

    res.clearCookie('sessionId');
    res.clearCookie('sessionToken');
    res.status(204).json({
        status: 204,
        message: 'Successfully logged out user!',
        data: {},
    });
};

