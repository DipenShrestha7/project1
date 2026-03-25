import WishlistModel from "../models/WishlistModel";

function authenticateWishlistRoute(fastify) {
  fastify.post("/wishlist", async (request, reply) => {
    try {
      const { user_id, city_id, location_id } = request.body;
      const wishlistItem = await WishlistModel.create({
        user_id,
        city_id,
        location_id,
      });
      reply.status(201).send(wishlistItem);
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}

export default authenticateWishlistRoute;
