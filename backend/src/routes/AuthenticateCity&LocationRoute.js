import CitiesModel from "../models/CitiesModel.js";
import LocationsModel from "../models/LocationsModel.js";
import ImageModel from "../models/ImageModel.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../config/cloudinary.js";
const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, "");

const readStreamToBuffer = async (stream) => {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

const getLocationUploadTarget = async (location_id) => {
  const location = await LocationsModel.findOne({ where: { location_id } });
  if (!location) return null;

  return { location };
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
      let location_id;
      let image_url = null;
      let image_key = null;
      let imageBuffer = null;

      for await (const part of parts) {
        if (part.type === "field") {
          if (part.fieldname === "location_id") {
            location_id = part.value;
          } else if (part.fieldname === "image_url") {
            image_url = part.value?.trim() || null;
          }
        } else if (part.type === "file") {
          imageBuffer = await readStreamToBuffer(part.file);
        }
      }

      if (!location_id) {
        return reply.code(400).send({ message: "location_id is required" });
      }

      const uploadTarget = await getLocationUploadTarget(location_id);
      if (!uploadTarget) {
        return reply.code(404).send({ message: "Location not found" });
      }

      if (imageBuffer) {
        const uploaded = await uploadImageToCloudinary({
          buffer: imageBuffer,
          folder: "project1/locations",
        });

        image_url = uploaded.image_url;
        image_key = uploaded.image_key;
      }

      if (!image_url) {
        return reply.code(400).send({ message: "No image file uploaded" });
      }

      const image = await ImageModel.create({
        location_id,
        image_url,
        image_key,
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
      let nextImageKey = null;
      let nextImageBuffer = null;

      for await (const part of parts) {
        if (part.type === "field" && part.fieldname === "image_url") {
          nextImageUrl = part.value?.trim() || null;
        }

        if (part.type === "file") {
          nextImageBuffer = await readStreamToBuffer(part.file);
        }
      }

      const updateData = {};

      if (nextImageBuffer) {
        if (existingImage.image_key) {
          try {
            await deleteImageFromCloudinary(existingImage.image_key);
          } catch (deleteError) {
            console.warn(
              "Failed to delete old Cloudinary image:",
              deleteError?.message || deleteError,
            );
          }
        }

        const uploaded = await uploadImageToCloudinary({
          buffer: nextImageBuffer,
          folder: "project1/locations",
        });

        nextImageUrl = uploaded.image_url;
        nextImageKey = uploaded.image_key;
      }

      if (nextImageUrl && !nextImageBuffer && existingImage.image_key) {
        try {
          await deleteImageFromCloudinary(existingImage.image_key);
        } catch (deleteError) {
          console.warn(
            "Failed to delete old Cloudinary image:",
            deleteError?.message || deleteError,
          );
        }
      }

      if (nextImageUrl) {
        updateData.image_url = nextImageUrl;
        updateData.image_key = nextImageKey;
      }

      if (!updateData.image_url) {
        return reply
          .code(400)
          .send({ error: "Please provide a new image file to update" });
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
      const image = await ImageModel.findOne({ where: { image_id } });
      if (!image) {
        return reply.code(404).send({ message: "Image not found" });
      }

      if (image.image_key) {
        try {
          await deleteImageFromCloudinary(image.image_key);
        } catch (deleteError) {
          console.warn(
            "Failed to delete Cloudinary image before DB delete:",
            deleteError?.message || deleteError,
          );
        }
      }

      const removed_image = await ImageModel.destroy({ where: { image_id } });

      return { removed_image };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ message: err.message });
    }
  });
}

export default authenticateCityLocationRoutes;
