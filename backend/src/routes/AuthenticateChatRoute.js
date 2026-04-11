import ChatMessageModel from "../models/ChatMessagesModel.js";
import ChatSessionModel from "../models/ChatSessionsModel.js";
import UsersModel from "../models/UsersModel.js";
import authHook from "../hooks/auth.js";

function AuthenticateChatRoute(fastify) {
  // POST /api/chat - Save a message and create session if needed
  fastify.post("/chat", { preHandler: authHook }, async (request, reply) => {
    const userId = Number(request.user?.user_id);
    let { session_id, message } = request.body;

    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        return reply.code(401).send({
          success: false,
          error: "Invalid auth token payload",
          code: "INVALID_AUTH_PAYLOAD",
        });
      }

      const user = await UsersModel.findOne({ where: { user_id: userId } });
      if (!user) {
        return reply.code(401).send({
          success: false,
          error: "User from token no longer exists. Please log in again.",
          code: "TOKEN_USER_NOT_FOUND",
        });
      }

      if (typeof message !== "string" || !message.trim()) {
        return reply.code(400).send({
          success: false,
          error: "Message is required",
        });
      }
      message = message.trim();

      if (session_id) {
        const existingSession = await ChatSessionModel.findOne({
          where: { session_id, user_id: userId },
        });

        if (!existingSession) {
          return reply.code(404).send({
            success: false,
            error: "Session not found for this user",
          });
        }
      }

      // create session if first message
      if (!session_id) {
        const chatSession = await ChatSessionModel.create({
          user_id: userId,
          title: message.slice(0, 40),
        });
        session_id = chatSession.session_id;
      }

      // fetch history for AI context
      const messages = await ChatMessageModel.findAll({
        where: { session_id },
        order: [
          ["created_at", "ASC"],
          ["message_id", "ASC"],
        ],
      });

      const history = messages.map((m) => {
        return { role: m.sender, content: m.message };
      });

      // Debug: Log what we're sending
      const requestBody = {
        message,
        session_id: String(session_id), // ← Convert to string for Python
        history,
      };
      // Save the user message to database
      await ChatMessageModel.create({
        session_id,
        sender: "user",
        message,
      });

      // one call to Python — with history for context
      const aiRes = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!aiRes.ok) {
        throw new Error(`Agent service failed with status ${aiRes.status}`);
      }

      const aiData = await aiRes.json(); // use this, not a second call
      const aiReply =
        typeof aiData?.reply === "string"
          ? aiData.reply
          : "Sorry, I could not generate a response right now.";

      // save both messages
      await ChatMessageModel.create({
        session_id,
        sender: "ai",
        message: aiReply,
      });

      return reply.send({ success: true, session_id, reply: aiReply });
    } catch (err) {
      if (err?.name === "SequelizeForeignKeyConstraintError") {
        return reply.code(409).send({
          success: false,
          error: "User-session relationship is invalid. Please log in again.",
          code: "FK_USER_SESSION_MISMATCH",
        });
      }

      console.error("Chat Route Error:", err.message);
      return reply.code(500).send({ success: false, error: err.message });
    }
  });

  // GET /api/sessions - Get all chat sessions for logged-in user
  fastify.get("/sessions", { preHandler: authHook }, async (request, reply) => {
    const userId = request.user.user_id;

    try {
      const sessions = await ChatSessionModel.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
      });

      return reply.send(sessions);
    } catch (err) {
      console.error("Fetch Sessions Error:", err.message);
      fastify.log.error(err);
      return reply.code(500).send({
        success: false,
        error: "Failed to fetch sessions",
      });
    }
  });

  // GET /api/sessions/:id/messages - Get chat messages for a specific session
  fastify.get(
    "/sessions/:id/messages",
    { preHandler: authHook },
    async (request, reply) => {
      const userId = request.user.user_id;
      const sessionId = request.params.id;

      try {
        const session = await ChatSessionModel.findOne({
          where: { session_id: sessionId, user_id: userId },
        });

        if (!session) {
          return reply.code(404).send({
            success: false,
            error: "Session not found",
          });
        }

        const messages = await ChatMessageModel.findAll({
          where: { session_id: sessionId },
          order: [
            ["created_at", "ASC"],
            ["message_id", "ASC"],
          ],
        });

        return reply.send(messages);
      } catch (err) {
        console.error("Fetch Session Messages Error:", err.message);
        fastify.log.error(err);
        return reply.code(500).send({
          success: false,
          error: "Failed to fetch chat messages",
        });
      }
    },
  );

  // PATCH /api/sessions/:id - Update chat session title
  fastify.patch(
    "/sessions/:id",
    { preHandler: authHook },
    async (request, reply) => {
      const userId = request.user.user_id;
      const sessionId = request.params.id;
      const { title } = request.body;

      try {
        if (!title || typeof title !== "string" || !title.trim()) {
          return reply.code(400).send({
            success: false,
            error: "Title is required",
          });
        }

        const session = await ChatSessionModel.findOne({
          where: { session_id: sessionId, user_id: userId },
        });

        if (!session) {
          return reply.code(404).send({
            success: false,
            error: "Session not found",
          });
        }

        await ChatSessionModel.update(
          { title: title.trim() },
          { where: { session_id: sessionId, user_id: userId } },
        );

        return reply.send({
          success: true,
          message: "Session title updated",
          title: title.trim(),
        });
      } catch (err) {
        console.error("Update Session Error:", err.message);
        fastify.log.error(err);
        return reply.code(500).send({
          success: false,
          error: "Failed to update session",
        });
      }
    },
  );

  // DELETE /api/sessions/:id - Delete a chat session
  fastify.delete(
    "/sessions/:id",
    { preHandler: authHook },
    async (request, reply) => {
      const userId = request.user.user_id;
      const sessionId = request.params.id;

      try {
        // Verify the session belongs to the user
        const session = await ChatSessionModel.findOne({
          where: { session_id: sessionId, user_id: userId },
        });

        if (!session) {
          return reply.code(404).send({
            success: false,
            error: "Session not found",
          });
        }

        // Delete all messages in the session
        await ChatMessageModel.destroy({
          where: { session_id: sessionId },
        });

        // Delete the session
        await ChatSessionModel.destroy({
          where: { session_id: sessionId },
        });

        return reply.send({
          success: true,
          message: "Session deleted",
        });
      } catch (err) {
        console.error("Delete Session Error:", err.message);
        fastify.log.error(err);
        return reply.code(500).send({
          success: false,
          error: "Failed to delete session",
        });
      }
    },
  );
}

export default AuthenticateChatRoute;
