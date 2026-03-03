import CitiesModel from "../models/CitiesModel.js";
import LocationsModel from "../models/LocationsModel.js";
const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, "");
function authenticateCityLocationRoutes(fastify) {
  //City
  fastify.post("/admin/cities", async (request, reply) => {
    const { city_name, description } = request.body;
    try {
      const city = await CitiesModel.create({
        city_name: city_name.toLowerCase(),
        description,
      });
      return {
        message: "City created successfully",
        city,
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.put("/admin/city/:city_id", async (request, reply) => {
    const { city_id } = request.params;
    const { city_name, description } = request.body;

    try {
      const updated_city = await CitiesModel.update(
        {
          city_name: normalize(city_name),
          description,
        },
        { where: { city_id } },
      );
      return {
        message: "City Updated Successfully",
        updated_city,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err.message });
    }
  });

  fastify.get("/admin/cities", async (request, reply) => {
    try {
      const cities = await CitiesModel.findAll();
      return cities;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/city/:city_id", async (request, reply) => {
    const { city_id } = request.params;

    try {
      const city = await CitiesModel.findOne({ where: { city_id } });
      return city;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/city/name/:city_name", async (request, reply) => {
    const { city_name } = request.params;

    try {
      const city = await CitiesModel.findOne({
        where: { city_name: city_name.toLowerCase() },
      });
      return city;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.delete("/admin/city/:city_id", async (request, reply) => {
    const { city_id } = request.params;

    try {
      const removed_city = await CitiesModel.destroy({ where: { city_id } });
      return { removed_city };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: err.message });
    }
  });

  //Location
  fastify.post("/admin/location", async (request, reply) => {
    const { location_name, description, city_id, latitude, longitude } =
      request.body;
    try {
      const location = await LocationsModel.create({
        location_name: normalize(location_name),
        description,
        city_id,
        latitude,
        longitude,
      });
      return {
        message: "Location created successfully",
        location,
      };
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/locations", async (request, reply) => {
    try {
      const locations = await LocationsModel.findAll();
      return locations;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/location/:location_id", async (request, reply) => {
    const { location_id } = request.params;

    try {
      const location = await LocationsModel.findOne({ where: { location_id } });
      return location;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });
  fastify.get("/admin/location/name/:location_name", async (request, reply) => {
    const { location_name } = request.params;

    try {
      const location = await LocationsModel.findOne({
        where: {
          location_name: normalize(location_name),
        },
      });
      return location;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.put("/admin/location/:location_id", async (request, reply) => {
    const { location_id } = request.params;
    const { location_name, description, latitude, longitude } = request.body;

    try {
      const updated_location = await LocationsModel.update(
        {
          location_name: normalize(location_name),
          description,
          latitude,
          longitude,
        },
        { where: { location_id } },
      );
      return {
        message: "Location Updated Successfully",
        updated_location,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err.message });
    }
  });

  fastify.delete("/admin/location/:location_id", async (request, reply) => {
    const { location_id } = request.params;

    try {
      const removed_location = await LocationsModel.destroy({
        where: { location_id },
      });
      return { removed_location };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: err.message });
    }
  });
}

export default authenticateCityLocationRoutes;
