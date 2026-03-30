import ChatMessageModel from "../models/ChatMessagesModel.js";
import ChatSessionModel from "../models/ChatSessionsModel.js";
import authHook from "../hooks/auth.js";

function AuthenticateChatRoute(fastify) {
  // POST /api/chat - Save a message and create session if needed
  fastify.post("/chat", { preHandler: authHook }, async (request, reply) => {
    const userId = request.user.user_id;
    let { session_id, message } = request.body;

    try {
      // Create a new session if this is the first message
      if (!session_id) {
        const chatSession = await ChatSessionModel.create({
          user_id: userId,
          title: message.slice(0, 40),
        });
        session_id = chatSession.session_id;
      }

      // Save the user message to database
      await ChatMessageModel.create({
        session_id,
        sender: "user",
        message,
      });

      // Return success response with session_id and a placeholder reply
      return reply.send({
        success: true,
        session_id,
        reply: "Thank you for your message. This is a placeholder response.",
      });
    } catch (err) {
      console.error("Chat Route Error:", err.message);
      fastify.log.error(err);
      return reply.code(500).send({
        success: false,
        error: err.message || "Failed to save message",
      });
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
