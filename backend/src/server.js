import sequelize from "./config/db.js";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import authenticateUsersRoutes from "./routes/AuthenticateUsersRoute.js";
import authenticateCityLocationRoutes from "./routes/AuthenticateCity&LocationRoute.js";
import authenticateWishlistRoute from "./routes/AuthenticateWishlistRoute.js";
import authenticateHistoryRoute from "./routes/AuthenticateHistoryRoute.js";
import authenticateChatRoute from "./routes/AuthenticateChatRoute.js";
import authenticateGoogleRoute from "./routes/AuthenticateGoogleRoute.js";
import "dotenv/config";
import path from "path";

const fastify = Fastify({ logger: true });

const normalizeOrigin = (value) => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim().replace(/^"|"$/g, "").replace(/\/$/, "");
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
};

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    process.env.WEBSITE_URL,
    process.env.FRONTEND_URL,
    process.env.VITE_WEBSITE_URL,
    process.env.VERCEL_URL,
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    const normalizedOrigin = normalizeOrigin(origin);

    if (
      !normalizedOrigin ||
      allowedOrigins.has(normalizedOrigin) ||
      normalizedOrigin.endsWith(".vercel.app")
    ) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

fastify.addHook("onSend", (request, reply, payload, done) => {
  reply.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  done();
});

fastify.register(multipart, {
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    fastify.register(authenticateUsersRoutes, { prefix: "/api" });
    fastify.register(authenticateCityLocationRoutes, { prefix: "/api" });
    fastify.register(authenticateWishlistRoute, { prefix: "/api" });
    // `AuthenticateHistoryRoute` already defines routes starting with `/api/...`,
    // so register it without an additional `/api` prefix to avoid `/api/api/...`.
    fastify.register(authenticateHistoryRoute, { prefix: "/api" });
    fastify.register(authenticateChatRoute, { prefix: "/api" });
    fastify.register(authenticateGoogleRoute, { prefix: "/api" });

    const port = process.env.PORT || 9000;
    await fastify.listen({ port: port, host: "0.0.0.0" });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
