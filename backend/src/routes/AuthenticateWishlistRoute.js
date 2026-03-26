import WishlistModel from "../models/WishlistModel.js";

function authenticateWishlistRoute(fastify) {
  fastify.post("/wishlist", async (request, reply) => {
    try {
      const { user_id, city_id, location_id } = request.body;
      if (!user_id || (!city_id && !location_id)) {
        return reply
          .status(400)
          .send({ error: "user_id and city_id or location_id are required" });
      }

      if (city_id && location_id) {
        return reply
          .status(400)
          .send({ error: "Provide either city_id or location_id, not both" });
      }

      const existingWishlistItem = await WishlistModel.findOne({
        where: {
          user_id,
          city_id: city_id ?? null,
          location_id: location_id ?? null,
        },
      });

      if (existingWishlistItem) {
        return reply.status(200).send(existingWishlistItem);
      }

      const wishlistItem = await WishlistModel.create({
        user_id,
        city_id: city_id ?? null,
        location_id: location_id ?? null,
      });
      reply.status(201).send(wishlistItem);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/wishlist/:userId", async (request, reply) => {
    try {
      const { userId } = request.params;
      const wishlist = await WishlistModel.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
      });
      reply.status(200).send(wishlist);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.delete("/wishlist", async (request, reply) => {
    try {
      const { user_id, city_id, location_id } = request.body;

      if (!user_id || (!city_id && !location_id)) {
        return reply
          .status(400)
          .send({ error: "user_id and city_id or location_id are required" });
      }

      if (city_id && location_id) {
        return reply
          .status(400)
          .send({ error: "Provide either city_id or location_id, not both" });
      }

      const deletedCount = await WishlistModel.destroy({
        where: {
          user_id,
          city_id: city_id ?? null,
          location_id: location_id ?? null,
        },
      });

      if (deletedCount === 0) {
        return reply.status(404).send({ error: "Wishlist item not found" });
      }

      reply.status(200).send({ message: "Wishlist item removed" });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}

export default authenticateWishlistRoute;
