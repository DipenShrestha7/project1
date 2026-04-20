import CitiesModel from "../models/CitiesModel.js";
import LocationsModel from "../models/LocationsModel.js";
import ImageModel from "../models/ImageModel.js";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, "");

const resolveLocalUploadPath = (imagePathOrUrl) => {
  if (!imagePathOrUrl || typeof imagePathOrUrl !== "string") return null;

  let normalized = imagePathOrUrl;
  try {
    if (/^https?:\/\//i.test(imagePathOrUrl)) {
      normalized = new URL(imagePathOrUrl).pathname;
    }
  } catch {
    return null;
  }

  if (!normalized.startsWith("/uploads/")) return null;
  const relative = normalized.replace(/^\/uploads\//, "");
  return path.join(process.cwd(), "uploads", relative);
};

const removeLocalUploadIfExists = async (imagePathOrUrl) => {
  const filePath = resolveLocalUploadPath(imagePathOrUrl);
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn("Failed to delete old image file:", filePath, err.message);
    }
  }
};

const getLocationUploadTarget = async (location_id) => {
  const location = await LocationsModel.findOne({ where: { location_id } });
  if (!location) return null;

  const cityFolder = `city_${location.city_id}`;
  const locationFolder = `location_${location.location_id}`;
  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "locations",
    cityFolder,
    locationFolder,
  );

  return {
    location,
    uploadDir,
    relativeUrlBase: `locations/${cityFolder}/${locationFolder}`,
  };
};

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
      const existingCity = await CitiesModel.findOne({ where: { city_id } });
      if (!existingCity) {
        return reply.code(404).send({ error: "City not found" });
      }

      const resolvedCityName =
        typeof city_name === "string" && city_name.trim()
          ? normalize(city_name)
          : existingCity.city_name;
      const resolvedDescription =
        typeof description === "string" && description.trim()
          ? description
          : existingCity.description;

      const updated_city = await CitiesModel.update(
        {
          city_name: resolvedCityName,
          description: resolvedDescription,
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

  fastify.get("/admin/location/city/:city_id", async (request, reply) => {
    const { city_id } = request.params;

    try {
      const locations = await LocationsModel.findAll({ where: { city_id } });
      return locations;
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

    try {
      const existingLocation = await LocationsModel.findOne({
        where: { location_id },
      });
      if (!existingLocation) {
        return reply.code(404).send({ error: "Location not found" });
      }

      const resolvedLocationName =
        typeof location_name === "string" && location_name.trim()
          ? location_name
          : existingLocation.location_name;
      const resolvedDescription =
        typeof description === "string" && description.trim()
          ? description
          : existingLocation.description;

      const hasLatitude = !(latitude == null || latitude === "");
      const hasLongitude = !(longitude == null || longitude === "");
      const parsedLatitude = hasLatitude ? Number(latitude) : null;
      const parsedLongitude = hasLongitude ? Number(longitude) : null;

      const resolvedLatitude =
        hasLatitude && Number.isFinite(parsedLatitude)
          ? parsedLatitude
          : existingLocation.latitude;
      const resolvedLongitude =
        hasLongitude && Number.isFinite(parsedLongitude)
          ? parsedLongitude
          : existingLocation.longitude;

      const updated_location = await LocationsModel.update(
        {
          location_name: resolvedLocationName,
          description: resolvedDescription,
          latitude: resolvedLatitude,
          longitude: resolvedLongitude,
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
      let location_id, image_url;

      for await (const part of parts) {
        if (part.type === "field") {
          if (part.fieldname === "location_id") {
            location_id = part.value;
          }
        } else if (part.type === "file") {
          if (!location_id) {
            return reply.code(400).send({
              message:
                "location_id must be provided before the image file in multipart form data",
            });
          }

          const uploadTarget = await getLocationUploadTarget(location_id);
          if (!uploadTarget) {
            return reply.code(404).send({ message: "Location not found" });
          }

          const { uploadDir, relativeUrlBase } = uploadTarget;
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(part.filename) || ".jpg";
          const filename = `${uniqueSuffix}${ext}`;
          const savePath = path.join(uploadDir, filename);

          await pipeline(part.file, fs.createWriteStream(savePath));
          image_url = `http://localhost:9000/uploads/${relativeUrlBase}/${filename}`;
        }
      }

      if (!image_url) {
        return reply.code(400).send({ message: "No image file uploaded" });
      }

      if (!location_id) {
        return reply.code(400).send({ message: "location_id is required" });
      }

      const image = await ImageModel.create({
        location_id,
        image_url,
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
      const existingImage = await ImageModel.findOne({ where: { image_id } });
      if (!existingImage) {
        return reply.code(404).send({ error: "Image not found" });
      }

      const parts = request.parts();
      let nextImageUrl = null;

      for await (const part of parts) {
        if (part.type === "file") {
          const uploadTarget = await getLocationUploadTarget(
            existingImage.location_id,
          );
          if (!uploadTarget) {
            return reply
              .code(404)
              .send({ error: "Location linked to this image was not found" });
          }

          const { uploadDir, relativeUrlBase } = uploadTarget;
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(part.filename) || ".jpg";
          const filename = `${uniqueSuffix}${ext}`;
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const savePath = path.join(uploadDir, filename);

          await pipeline(part.file, fs.createWriteStream(savePath));

          nextImageUrl = `http://localhost:9000/uploads/${relativeUrlBase}/${filename}`;
        }
      }

      const updateData = {};
      if (nextImageUrl) {
        updateData.image_url = nextImageUrl;
      }

      if (!updateData.image_url) {
        return reply
          .code(400)
          .send({ error: "Please provide a new image file to update" });
      }

      const updated_image = await ImageModel.update(updateData, {
        where: { image_id },
      });

      if (existingImage.image_url !== updateData.image_url) {
        await removeLocalUploadIfExists(existingImage.image_url);
      }

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
      const image = await ImageModel.findOne({ where: { image_id } });
      if (!image) {
        return reply.code(404).send({ message: "Image not found" });
      }

      const removed_image = await ImageModel.destroy({ where: { image_id } });

      if (removed_image) {
        await removeLocalUploadIfExists(image.image_url);
      }

      return { removed_image };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: err.message });
    }
  });
}

export default authenticateCityLocationRoutes;
