import React from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  Heart,
  History,
  MoreVertical,
  Star,
  UserCircle2,
} from "lucide-react";
import type { Locations, Images, Review } from "./types";

interface LocationDetailsViewProps {
  currentLocation?: Locations;
  parsedLatitude: number;
  parsedLongitude: number;
  hasValidCoordinates: boolean;
  googleMapsUrl: string;
  mapEmbedUrl: string;
  wishlistLocationIds: Set<number>;
  toggleLocationWishlist: (id: number) => void;
  travelHistoryLocationIds: Set<number>;
  toggleLocationCollection: (
    locationId: number,
    collection: "wishlist" | "travelHistory",
  ) => void;
  filteredImages: Images[];
  flippedImageIds: Set<number>;
  setFlippedImageIds: (s: Set<number>) => void;
  setSelectedLocation: (id: number | null) => void;
  locationReviews: Review[];
}

const LocationDetailsView: React.FC<LocationDetailsViewProps> = ({
  currentLocation,
  parsedLatitude,
  parsedLongitude,
  hasValidCoordinates,
  googleMapsUrl,
  mapEmbedUrl,
  wishlistLocationIds,
  toggleLocationWishlist,
  travelHistoryLocationIds,
  toggleLocationCollection,
  filteredImages,
  flippedImageIds,
  setFlippedImageIds,
  setSelectedLocation,
  locationReviews,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isWishlistDropdownOpen, setIsWishlistDropdownOpen] =
    React.useState(false);

  return (
    <div
      onClick={() => {
        setIsDropdownOpen(false);
        setIsWishlistDropdownOpen(false);
      }}
    >
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedLocation(null)}
                aria-label="Back"
                className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-3xl font-semibold leading-tight text-sky-900 dark:text-sky-400">
                {currentLocation?.name}
              </h2>
            </div>

            <p className="mt-4 text-justify text-slate-700 dark:text-slate-300">
              {currentLocation?.description}
            </p>

            {currentLocation && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="relative flex">
                  {wishlistLocationIds.has(currentLocation.id) ? (
                    <div className="flex">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-l-lg border-y border-l font-medium cursor-default transition bg-pink-100 border-pink-300 text-pink-700 dark:bg-pink-700 dark:border-pink-600 dark:text-white"
                      >
                        <Heart size={15} />
                        In Wishlist
                        <Check size={15} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsWishlistDropdownOpen(!isWishlistDropdownOpen);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center justify-center px-2 border-y border-r rounded-r-lg font-medium cursor-pointer transition bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 dark:bg-pink-700 dark:border-pink-600 dark:text-white dark:hover:bg-pink-600"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isWishlistDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLocationWishlist(currentLocation.id);
                              setIsWishlistDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            Remove from Wishlist
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsWishlistDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleLocationWishlist(currentLocation.id)}
                      className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-lg border font-medium transition cursor-pointer bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                      <Heart size={15} />
                      Add to Wishlist
                    </button>
                  )}
                </div>
                <div className="relative flex">
                  {travelHistoryLocationIds.has(currentLocation.id) ? (
                    <div className="flex">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-l-lg border-y border-l font-medium cursor-default transition bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-700 dark:border-emerald-600 dark:text-white"
                      >
                        <History size={15} />
                        Visited
                        <Check size={15} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsDropdownOpen(!isDropdownOpen);
                          setIsWishlistDropdownOpen(false);
                        }}
                        className="flex items-center justify-center px-2 border-y border-r rounded-r-lg font-medium cursor-pointer transition bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-700 dark:border-emerald-600 dark:text-white dark:hover:bg-emerald-600"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLocationCollection(
                                currentLocation.id,
                                "travelHistory",
                              );
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            Remove from Visited
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        toggleLocationCollection(
                          currentLocation.id,
                          "travelHistory",
                        )
                      }
                      className="flex items-center gap-2 text-sm px-3.5 py-2 rounded-lg border font-medium transition cursor-pointer bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                      <History size={15} />
                      Mark Visited
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            {hasValidCoordinates ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Coordinates: {parsedLatitude.toFixed(6)},{" "}
                    {parsedLongitude.toFixed(6)}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
                <iframe
                  title="Location map"
                  src={mapEmbedUrl}
                  className="w-full h-84 rounded-xl border border-slate-200 dark:border-slate-700"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Map unavailable: this location is missing valid
                latitude/longitude.
              </p>
            )}
          </div>
        </div>

        <div className="py-4 w-1/3"></div>
        <div className="flex items-center gap-2 mb-6">
          <Camera className="text-sky-600" />
          <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400">
            Location Images
          </h2>
        </div>
      </div>

      {filteredImages.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          No images available
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="h-64 cursor-pointer perspective"
            onClick={() => {
              const newFlipped = new Set(flippedImageIds);
              if (newFlipped.has(img.id)) {
                newFlipped.delete(img.id);
              } else {
                newFlipped.add(img.id);
              }
              setFlippedImageIds(newFlipped);
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: flippedImageIds.has(img.id)
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
              }}
            >
              {/* Front - Image */}
              <div
                className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src={img.image_url}
                  className="w-full h-full object-cover"
                  alt={img.image_description}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 text-white text-xs">
                  Click to see description
                </div>
              </div>

              {/* Back - Description */}
              <div
                className="absolute w-full h-full bg-sky-600 dark:bg-sky-700 rounded-2xl shadow-md overflow-hidden p-6 flex flex-col justify-between"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div>
                  <h3 className="text-white font-semibold text-lg mb-3">
                    Description
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {img.image_description || "No description available"}
                  </p>
                </div>
                <div className="text-white/70 text-xs text-center">
                  Click to go back
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Public Reviews Section */}
      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-semibold text-sky-900 dark:text-sky-400 mb-6">
          Public Reviews
        </h3>

        {locationReviews && locationReviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {locationReviews.map((review, idx) => {
              // Ensure we prepend the localhost backend URL if it's a relative path, but keep external URLs or blank ones intact
              let avatarSrc = null;
              if (review.profile_image) {
                if (review.profile_image.startsWith("http")) {
                  avatarSrc = review.profile_image;
                } else if (!review.profile_image.startsWith("/")) {
                  avatarSrc = `http://localhost:9000/${review.profile_image}`;
                } else {
                  avatarSrc = `http://localhost:9000${review.profile_image}`;
                }
              }

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={review.user_name}
                        className="w-10 h-10 object-cover rounded-full border border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <UserCircle2 size={40} className="text-slate-400" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {review.user_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {review.travel_date}
                      </p>
                    </div>
                    {review.rating && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= (review.rating ?? 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300 dark:text-slate-600"
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {review.review_text}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">
            No public reviews yet for this location.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationDetailsView;
