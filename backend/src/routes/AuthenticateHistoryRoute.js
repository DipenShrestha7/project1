import HistoryModel from "../models/HistoryModel.js";
import UsersModel from "../models/UsersModel.js";

function authenticateHistoryRoute(fastify) {
  fastify.get("/history/:userId", async (request, reply) => {
    const { userId } = request.params;

    const history = await HistoryModel.findAll({
      where: { user_id: userId },
      order: [["travel_date", "DESC"]],
    });

    return reply.send(history);
  });

  fastify.get("/location/:location_id/reviews", async (request, reply) => {
    const { location_id } = request.params;

    try {
      HistoryModel.belongsTo(UsersModel, { foreignKey: "user_id" });

      const historyItems = await HistoryModel.findAll({
        where: { location_id },
        include: [
          { model: UsersModel, attributes: ["user_name", "profile_image"] },
        ],
        order: [["travel_date", "DESC"]],
      });

      const reviews = historyItems
        .filter((h) => h.review_text && h.review_text.trim() !== "")
        .map((h) => {
          const user = h.user || h.User || {};
          return {
            user_name: user.user_name || "Unknown User",
            profile_image: user.profile_image || null,
            rating: h.rating,
            review_text: h.review_text,
            travel_date: h.travel_date,
          };
        });

      return reply.send(reviews);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.post("/history/visited", async (request, reply) => {
    const { user_id, location_id } = request.body;

    const existing = await HistoryModel.findOne({
      where: { user_id, location_id },
    });

    // If already visited, delete the row(s) so the second click "unmarks" it.
    if (existing) {
      await HistoryModel.destroy({
        where: { user_id, location_id },
      });
      return reply.send({ visited: false });
    }

    // Use local date (not UTC) so it matches the day the user clicked.
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}`;

    const created = await HistoryModel.create({
      user_id,
      location_id,
      travel_date: currentDate,
      // On "mark visited", review/rating should start empty.
      review_text: null,
      rating: null,
    });

    return reply.send({ visited: true, travel_id: created.travel_id });
  });

  fastify.patch("/history/review", async (request, reply) => {
    const { user_id, location_id, review_text, rating } = request.body;

    const history = await HistoryModel.findOne({
      where: { user_id, location_id },
      order: [["travel_date", "DESC"]],
    });

    if (!history) {
      return reply
        .status(404)
        .send({ error: "History entry not found for this user/location" });
    }

    history.review_text = review_text ?? null;

    // Allow null, otherwise enforce numeric rating.
    const parsedRating =
      rating === null || rating === undefined || rating === ""
        ? null
        : Number(rating);
    history.rating =
      parsedRating === null
        ? null
        : Number.isFinite(parsedRating)
          ? Math.min(5, Math.max(1, parsedRating))
          : null;

    await history.save();

    return reply.send(history);
  });

  fastify.delete("/history/review", async (request, reply) => {
    const { user_id, location_id } = request.body;

    const history = await HistoryModel.findOne({
      where: { user_id, location_id },
      order: [["travel_date", "DESC"]],
    });

    if (!history) {
      return reply
        .status(404)
        .send({ error: "History entry not found for this user/location" });
    }

    // Delete the review by setting text and rating to null
    history.review_text = null;
    history.rating = null;

    await history.save();

    return reply.send(history);
  });

  fastify.delete("/history", async (request, reply) => {
    const { user_id, location_id } = request.body;

    const history = await HistoryModel.findOne({
      where: { user_id, location_id },
    });

    await history.destroy();

    return reply.send({ message: "History deleted successfully" });
  });
}

export default authenticateHistoryRoute;
