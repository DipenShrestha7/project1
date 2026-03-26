import sequelize from "./config/db.js";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import authenticateUsersRoutes from "./routes/AuthenticateUsersRoute.js";
import authenticateCityLocationRoutes from "./routes/AuthenticateCity&LocationRoute.js";
import authenticateWishlistRoute from "./routes/AuthenticateWishlistRoute.js";
import authenticateHistoryRoute from "./routes/AuthenticateHistoryRoute.js";
import "dotenv/config";
import path from "path";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

fastify.register(multipart);
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
    fastify.register(authenticateHistoryRoute);

    const port = process.env.PORT || 9000;
    await fastify.listen({ port: port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
