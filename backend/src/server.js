import sequelize from "./config/db.js";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import authenticateUsersRoutes from "./routes/AuthenticateUsersRoute.js";
import "dotenv/config";
import path from "path";
import fs from "fs";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: "http://localhost:5173",
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
    const port = process.env.PORT || 9000;
    await fastify.listen({ port: port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
