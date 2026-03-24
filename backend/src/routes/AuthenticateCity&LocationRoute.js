import CitiesModel from "../models/CitiesModel.js";
import LocationsModel from "../models/LocationsModel.js";
import ImageModel from "../models/ImageModel.js";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
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
    let { location_name, description, city_id, latitude, longitude } =
      request.body;
    if (latitude == "") {
      latitude = null;
    }
    if (longitude == "") {
      longitude = null;
    }
    try {
      const location = await LocationsModel.create({
        location_name: location_name,
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
    let { location_name, description, latitude, longitude } = request.body;

    if (latitude == "") {
      latitude = null;
    }
    if (longitude == "") {
      longitude = null;
    }

    try {
      const updated_location = await LocationsModel.update(
        {
          location_name: location_name,
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

  //Image
  fastify.post("/admin/image", async (req, reply) => {
    try {
      const parts = req.parts();
      let location_id, image_description, fileData;

      for await (const part of parts) {
        if (part.type === "field") {
          if (part.fieldname === "location_id") {
            location_id = part.value;
          } else if (part.fieldname === "image_description") {
            image_description = part.value;
          }
        } else if (part.type === "file") {
          fileData = part;
        }
      }

      if (!fileData) {
        return reply.code(400).send({ message: "No image file uploaded" });
      }

      if (!location_id) {
        return reply.code(400).send({ message: "location_id is required" });
      }

      // Ensure directory exists
      const uploadDir = path.join(process.cwd(), "uploads", "locations");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(fileData.filename) || ".jpg";
      const filename = `${uniqueSuffix}${ext}`;
      const savePath = path.join(uploadDir, filename);

      await pipeline(fileData.file, fs.createWriteStream(savePath));

      const image_url = `http://localhost:9000/uploads/locations/${filename}`;

      const image = await ImageModel.create({
        location_id,
        image_url,
        image_description: image_description || null,
      });

      return {
        message: "Image uploaded and saved successfully",
        image,
      };
    } catch (error) {
      console.error(error);
      if (error.code === "FST_REQ_FILE_TOO_LARGE") {
        return reply.code(413).send({ message: "File too large" });
      }
      return reply.code(500).send({ message: error.message });
    }
  });

  fastify.get("/admin/images", async (request, reply) => {
    try {
      const images = await ImageModel.findAll();
      return images;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/image/:image_id", async (request, reply) => {
    const { image_id } = request.params;
    try {
      const image = await ImageModel.findOne({ where: { image_id } });
      return image;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.get("/admin/image/location/:location_id", async (request, reply) => {
    const { location_id } = request.params;
    try {
      const images = await ImageModel.findAll({ where: { location_id } });
      return images;
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: error.message });
    }
  });

  fastify.put("/admin/image/:image_id", async (request, reply) => {
    const { image_id } = request.params;
    try {
      const parts = request.parts();
      let image_description, fileData;

      for await (const part of parts) {
        if (part.type === "field") {
          if (part.fieldname === "image_description") {
            image_description = part.value;
          }
        } else if (part.type === "file") {
          fileData = part;
        }
      }

      const updateData = {};
      if (fileData) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(fileData.filename) || ".jpg";
        const filename = `${uniqueSuffix}${ext}`;
        const uploadDir = path.join(process.cwd(), "uploads", "locations");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const savePath = path.join(uploadDir, filename);

        await pipeline(fileData.file, fs.createWriteStream(savePath));

        updateData.image_url = `http://localhost:9000/uploads/locations/${filename}`;
      }
      if (image_description) {
        updateData.image_description = image_description;
      }
      const updated_image = await ImageModel.update(updateData, {
        where: { image_id },
      });
      return {
        message: "Image Updated Successfully",
        updated_image,
      };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: err.message });
    }
  });

  fastify.delete("/admin/image/:image_id", async (request, reply) => {
    const { image_id } = request.params;

    try {
      // Find the image first to optionally delete the file from the filesystem cleanly
      // We will skip actual fs deletion for now unless required, but we delete the DB record.
      const removed_image = await ImageModel.destroy({ where: { image_id } });
      return { removed_image };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: err.message });
    }
  });
}

export default authenticateCityLocationRoutes;
