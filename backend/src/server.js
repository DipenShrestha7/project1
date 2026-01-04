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
    const port = process.env.PORT || 9000;
    await fastify.listen({ port: port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
