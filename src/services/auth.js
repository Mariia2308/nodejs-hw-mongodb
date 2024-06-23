// src/services/auth.js
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Session } from "../models/session.js";
const createSession = () => {
    return {
        refreshTokenValidity: new Date(Date.now() + 60 * 7 * 24 * 60 * 1000),
        accessTokenValidity: new Date(Date.now() + 15 * 60 * 1000),
        accessToken: crypto.randomBytes(64).toString('base64'),
        refreshToken: crypto.randomBytes(64).toString('base64'),
    };

};

export const createUser = async (payload) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        {
            throw createHttpError(409, 'Email in use');
        };
    };
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    return await User.create({
        ...payload,
        password: hashedPassword,
    });
};
export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        {
            throw createHttpError(404, 'User not found');
        };
    };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        {
            throw createHttpError(401, 'Wrong password');
        };
    };

    await Session.deleteOne({ userId: user._id });


    return await Session.create({
        userId: user._id,
        ...createSession(),
    });


};

export const logoutUser = async ({ sessionId, sessionToken }) => {
    return await Session.deleteOne({
        _id: sessionId,
        refreshToken: sessionToken,
    });
};

export const refreshSession = async ({ sessionId, sessionToken }) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken: sessionToken
    });

    if (!session) {
        throw createHttpError(401, 'Invalid session');
    };

    if (Date.now() > session.refreshTokenValidity) {
        throw createHttpError(401, 'Session expired');
    };
    const user = await User.findById(session.userId);

    if (!user) {
        throw createHttpError(401, 'Invalid session');
    };

    await Session.deleteOne({ _id: session._id });

    return await Session.create({
        userId: user._id,
        ...createSession(),
    });
};
