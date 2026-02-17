import UsersModel from "../models/UsersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

function authenticateUsersRoute(fastify) {
  // SIGNUP
  fastify.post("/signup", async (req, reply) => {
    try {
      const { user_name, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UsersModel.create({
        user_name,
        email,
        password_hash: hashedPassword,
      });

      return {
        message: "User created",
        user: {
          user_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
        },
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  // VIEW USERS
  fastify.get("/users", async () => {
    const users = await UsersModel.findAll();

    return {
      message: "Users retrieved",
      users: users.map((user) => ({
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
      })),
    };
  });

  // LOGIN
  fastify.post("/login", async (req, reply) => {
    const { email, password } = req.body;

    try {
      const user = await UsersModel.findOne({ where: { email } });

      if (!user) {
        return reply.code(401).send({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return reply.code(401).send({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return {
        message: "Login successful",
        token,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.get("/dashboard", async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UsersModel.findOne({
        where: { user_id: decoded.user_id },
      });

      return {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        profile_image: user.profile_image || null,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Invalid token" });
    }
  });

  fastify.post("/dashboard/upload", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const data = await req.file(); // get uploaded file
      const uploadPath = path.join(process.cwd(), "uploads", data.filename);
      const writeStream = fs.createWriteStream(uploadPath);
      await data.file.pipe(writeStream);

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Save path in DB
      await UsersModel.update(
        { profile_image: `/uploads/${data.filename}` },
        { where: { user_id: decoded.user_id } },
      );

      return {
        message: "Image added successfully",
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err });
    }
  });
}

export default authenticateUsersRoute;
