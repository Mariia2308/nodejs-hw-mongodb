import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';


export const authintificate = async(req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        return next (createHttpError(401, 'Unauthorized'));
    }
    const [bearer, token] = header.split(' ');
    
    if (bearer !== 'Bearer' && !token) {
        return next (createHttpError(401, 'Bearer type is needed'));
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
        return next (createHttpError(401, 'Invalid session'));
    }
    if(Date.now() > session.accessTokenValidity) {
        return next (createHttpError(401, 'Session expired'));
    };

    const user = await User.findById(session.userId);
    if(!user) {
        next (createHttpError(401, 'Invalid user with this session'));
    }
    req.user = user;
    return next();
};