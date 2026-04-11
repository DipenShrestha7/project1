import { OAuth2Client } from "google-auth-library";
import UsersModel from "../models/UsersModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function handleGoogleAuth(request, reply) {
  const token =
    request.body?.token || request.body?.credential || request.query?.token;

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
    return reply.code(500).send({
      error: "Google sign-in is not configured on the server.",
    });
  }

  if (!token) {
    return reply.code(400).send({ error: "Google token is required." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return reply.code(401).send({
        error: "Google account email was not returned.",
      });
    }

    const fallbackName = payload.email.split("@")[0];
    const userName = payload.name || fallbackName;

    let user = await UsersModel.findOne({ where: { email: payload.email } });

    if (user) {
      await user.update({
        user_name: payload.name || user.user_name,
        profile_image: payload.picture || user.profile_image,
      });
    } else {
      user = await UsersModel.create({
        user_name: userName,
        email: payload.email,
        password_hash: crypto.randomBytes(32).toString("hex"),
        profile_image: payload.picture || null,
      });
    }

    const appToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return reply.send({
      message: "Google sign-in successful",
      token: appToken,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error(error);
    return reply.code(401).send({
      error: "Google sign-in failed.",
    });
  }
}

function AuthenticateGoogleRoute(fastify) {
  fastify.post("/auth/google", handleGoogleAuth);
  fastify.get("/auth/google/callback", handleGoogleAuth);
}

export default AuthenticateGoogleRoute;
