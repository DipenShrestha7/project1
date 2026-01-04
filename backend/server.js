import sequelize from "./src/config/db.js";
import Fastify from "fastify";
import authenticateUsersRoutes from "./src/routes/AuthenticateUsersRoute.js";
import "dotenv/config";

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    fastify.register(authenticateUsersRoutes, { prefix: "/api" });

    await fastify.listen({ port: 9000 });
    console.log("Server running on http://localhost:9000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
