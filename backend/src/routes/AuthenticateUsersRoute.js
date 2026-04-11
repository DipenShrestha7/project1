import UsersModel from "../models/UsersModel.js";
import WishlistModel from "../models/WishlistModel.js";
import HistoryModel from "../models/HistoryModel.js";
import ChatSessionModel from "../models/ChatSessionsModel.js";
import ChatMessageModel from "../models/ChatMessagesModel.js";
import UserReportsModel from "../models/UserReportsModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import sequelize from "../config/db.js";

function authenticateUsersRoute(fastify) {
  const getUserIdFromAuthHeader = (authHeader) => {
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id;
  };

  const tryGetUserIdFromAuthHeader = (authHeader) => {
    try {
      return getUserIdFromAuthHeader(authHeader);
    } catch {
      return null;
    }
  };

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

      if (!user.password_hash) {
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
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const user = await UsersModel.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

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
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const data = await req.file(); // get uploaded file
      const uploadPath = path.join(process.cwd(), "uploads", data.filename);
      const writeStream = fs.createWriteStream(uploadPath);
      await data.file.pipe(writeStream);

      // Save path in DB
      await UsersModel.update(
        { profile_image: `/uploads/${data.filename}` },
        { where: { user_id: userId } },
      );

      return {
        message: "Image added successfully",
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err });
    }
  });

  // UPDATE PROFILE IMAGE
  fastify.patch("/api/user/profile-image", async (req, reply) => {
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const { profile_image } = req.body;

      if (!profile_image) {
        return reply
          .code(400)
          .send({ error: "profile_image path is required" });
      }

      const user = await UsersModel.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      // Update user profile image
      await UsersModel.update(
        { profile_image },
        { where: { user_id: userId } },
      );

      return {
        message: "Profile image updated successfully",
        profile_image,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Failed to update profile image" });
    }
  });

  // UPDATE PROFILE IMAGE WITH FILE UPLOAD
  fastify.patch("/api/user/profile-image/upload", async (req, reply) => {
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const data = await req.file(); // get uploaded file
      const uploadPath = path.join(process.cwd(), "uploads", data.filename);
      const writeStream = fs.createWriteStream(uploadPath);
      await data.file.pipe(writeStream);

      const profileImagePath = `/uploads/${data.filename}`;

      // Update user profile image
      await UsersModel.update(
        { profile_image: profileImagePath },
        { where: { user_id: userId } },
      );

      return {
        message: "Profile image updated successfully",
        profile_image: profileImagePath,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Failed to update profile image" });
    }
  });

  fastify.patch("/dashboard/profile", async (req, reply) => {
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const { name, email } = req.body;

      const user = await UsersModel.findOne({ where: { user_id: userId } });
      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      const resolvedName =
        typeof name === "string" && name.trim() ? name.trim() : user.user_name;
      const resolvedEmail =
        typeof email === "string" && email.trim()
          ? email.trim().toLowerCase()
          : user.email;

      if (!resolvedName || !resolvedEmail) {
        return reply
          .code(400)
          .send({ message: "Name and email are required" });
      }

      if (resolvedEmail !== user.email) {
        const existingEmailUser = await UsersModel.findOne({
          where: { email: resolvedEmail },
        });

        if (existingEmailUser && existingEmailUser.user_id !== user.user_id) {
          return reply
            .code(409)
            .send({ message: "Email already in use by another account" });
        }
      }

      await UsersModel.update(
        {
          user_name: resolvedName,
          email: resolvedEmail,
        },
        { where: { user_id: userId } },
      );

      return {
        message: "Profile updated successfully",
        user: {
          id: user.user_id,
          name: resolvedName,
          email: resolvedEmail,
          profile_image: user.profile_image || null,
        },
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to update profile" });
    }
  });

  fastify.get("/dashboard/stats", async (req, reply) => {
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const [wishlistCount, historyCount, reviewCount, chatSessionsCount] =
        await Promise.all([
          WishlistModel.count({ where: { user_id: userId } }),
          HistoryModel.count({ where: { user_id: userId } }),
          HistoryModel.count({
            where: {
              user_id: userId,
              review_text: {
                [Op.ne]: null,
              },
            },
          }),
          ChatSessionModel.count({ where: { user_id: userId } }),
        ]);

      return {
        wishlistCount,
        visitedCount: historyCount,
        reviewCount,
        chatSessionsCount,
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to load account stats" });
    }
  });

  fastify.post("/reports", async (req, reply) => {
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        return reply.code(401).send({ message: "No token provided" });
      }

      const { type, message } = req.body;
      const allowedTypes = ["bug", "feedback", "feature_requests"];

      if (!allowedTypes.includes(type)) {
        return reply
          .code(400)
          .send({ message: "Invalid report type selected" });
      }

      if (typeof message !== "string" || !message.trim()) {
        return reply.code(400).send({ message: "Report message is required" });
      }

      const report = await UserReportsModel.create({
        user_id: userId,
        type,
        message: message.trim(),
      });

      return {
        message: "Report submitted successfully",
        report,
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to submit report" });
    }
  });

  fastify.get("/reports/public", async (req, reply) => {
    try {
      const userId = tryGetUserIdFromAuthHeader(req.headers.authorization);
      const { type, search, mine } = req.query;
      const allowedTypes = ["bug", "feedback", "feature_requests"];

      const where = {};

      if (typeof type === "string" && allowedTypes.includes(type)) {
        where.type = type;
      }

      if (typeof search === "string" && search.trim()) {
        where.message = { [Op.iLike]: `%${search.trim()}%` };
      }

      const wantsMine = String(mine).toLowerCase() === "true";
      if (wantsMine) {
        if (!userId) {
          return reply
            .code(401)
            .send({ message: "Login required to view your own reports" });
        }
        where.user_id = userId;
      }

      const reports = await UserReportsModel.findAll({
        where,
        attributes: ["report_id", "user_id", "type", "message", "status", "created_at"],
        order: [["created_at", "DESC"]],
        limit: 100,
      });

      const response = reports.map((report) => ({
        report_id: report.report_id,
        type: report.type,
        message: report.message,
        status: report.status,
        created_at: report.created_at,
        is_mine: userId ? report.user_id === userId : false,
      }));

      return response;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to fetch public reports" });
    }
  });

  fastify.get("/admin/reports", async (_req, reply) => {
    try {
      const reports = await UserReportsModel.findAll({
        order: [["created_at", "DESC"]],
      });
      return reports;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to fetch reports" });
    }
  });

  fastify.patch("/admin/reports/:report_id/status", async (req, reply) => {
    try {
      const { report_id } = req.params;
      const { status } = req.body;
      const allowedStatuses = ["open", "in_progress", "resolved", "closed"];

      if (!allowedStatuses.includes(status)) {
        return reply.code(400).send({ message: "Invalid status" });
      }

      const report = await UserReportsModel.findOne({ where: { report_id } });
      if (!report) {
        return reply.code(404).send({ message: "Report not found" });
      }

      await UserReportsModel.update({ status }, { where: { report_id } });

      return {
        message: "Report status updated",
        report_id,
        status,
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Failed to update report status" });
    }
  });

  fastify.delete("/dashboard/account", async (req, reply) => {
    const transaction = await sequelize.transaction();
    try {
      const userId = getUserIdFromAuthHeader(req.headers.authorization);
      if (!userId) {
        await transaction.rollback();
        return reply.code(401).send({ message: "No token provided" });
      }

      const sessions = await ChatSessionModel.findAll({
        where: { user_id: userId },
        attributes: ["session_id"],
        transaction,
      });

      const sessionIds = sessions.map((session) => session.session_id);
      if (sessionIds.length) {
        await ChatMessageModel.destroy({
          where: { session_id: sessionIds },
          transaction,
        });
      }

      await ChatSessionModel.destroy({ where: { user_id: userId }, transaction });
      await WishlistModel.destroy({ where: { user_id: userId }, transaction });
      await HistoryModel.destroy({ where: { user_id: userId }, transaction });
      await UserReportsModel.destroy({ where: { user_id: userId }, transaction });

      const removedUsers = await UsersModel.destroy({
        where: { user_id: userId },
        transaction,
      });

      if (!removedUsers) {
        await transaction.rollback();
        return reply.code(404).send({ message: "User not found" });
      }

      await transaction.commit();
      return { message: "Account deleted successfully" };
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return reply.code(500).send({ message: "Failed to delete account" });
    }
  });
}

export default authenticateUsersRoute;
