
import { createUser, logoutUser, refreshSession, loginUser, sendResetEmail, sendResetPassword } from "../services/auth.js";
import createHttpError from "http-errors";

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id,
    {
      httpOnly: true,
      expire: 7 * 24 * 60 * 60
    }
  );

  res.cookie('sessionToken', session.refreshToken,
    {
      httpOnly: true,
      expire: 7 * 24 * 60 * 60
    }
  );
  
};

export const registerUserController = async (req, res) => {
  const user = await createUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: { user },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'User is logged in!',
    data: {  accessToken:session.accessToken  },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');

  res.status(204).send();
};

export const refreshTokenController = async (req, res) => {
  try {
    const { sessionId, sessionToken } = req.cookies;

    if (!sessionId || !sessionToken) {
      throw createHttpError(400, 'Session ID and token must be provided');
    }

    const session = await refreshSession({ sessionId, sessionToken });

    setupSessionCookies(res, session);

    res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully!',
      data: { accessToken: session.accessToken },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const sendResetEmailController = async (req, res) => {
  try {
    console.log("Received email:", req.body.email);
    await sendResetEmail(req.body.email);
    res.json({
      status: 200,
      message: 'Reset password email was successfully sent!',
      data: {},
    });
  } catch (error) {
    console.error("Error in sendResetEmailController:", error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
export const sendResetPasswordController = async (req, res) => {
  await sendResetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};