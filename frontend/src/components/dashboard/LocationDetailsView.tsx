import React from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  Maximize2,
  MoreVertical,
  RotateCcw,
  Star,
  UserCircle2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Locations, Images, Review } from "./types";

interface LocationDetailsViewProps {
  currentLocation?: Locations;
  cityLocations: Locations[];
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
  setSelectedLocation: (id: number | null) => void;
  locationReviews: Review[];
}

const LocationDetailsView: React.FC<LocationDetailsViewProps> = ({
  currentLocation,
  cityLocations,
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
  setSelectedLocation,
  locationReviews,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isWishlistDropdownOpen, setIsWishlistDropdownOpen] =
    React.useState(false);
  const [expandedImageUrl, setExpandedImageUrl] = React.useState<string | null>(
    null,
  );
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!expandedImageUrl) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedImageUrl(null);
        setZoomLevel(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIndex =
          currentImageIndex === 0
            ? filteredImages.length - 1
            : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setExpandedImageUrl(filteredImages[prevIndex].image_url);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex =
          currentImageIndex === filteredImages.length - 1
            ? 0
            : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setExpandedImageUrl(filteredImages[nextIndex].image_url);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedImageUrl, filteredImages, currentImageIndex]);

  const openExpandedImage = (imageUrl: string) => {
    const imageIndex = filteredImages.findIndex(
      (img) => img.image_url === imageUrl,
    );
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setExpandedImageUrl(imageUrl);
    setZoomLevel(1);
  };

  const closeExpandedImage = () => {
    setExpandedImageUrl(null);
    setZoomLevel(1);
  };

  const increaseZoom = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 4));
  };

  const decreaseZoom = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const currentLocationIndex = currentLocation
    ? cityLocations.findIndex((location) => location.id === currentLocation.id)
    : -1;

  const goToAdjacentLocation = (direction: "next" | "previous") => {
    if (cityLocations.length === 0 || currentLocationIndex === -1) return;

    const offset = direction === "next" ? 1 : -1;
    const nextIndex =
      (currentLocationIndex + offset + cityLocations.length) %
      cityLocations.length;
    setSelectedLocation(cityLocations[nextIndex].id);
  };

  return (
    <div
      onClick={() => {
        setIsDropdownOpen(false);
        setIsWishlistDropdownOpen(false);
      }}
    >
      <section className="mb-8 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-slate-50 to-sky-100 p-5 sm:p-6 shadow-lg shadow-slate-300/40 dark:border-white/10 dark:from-slate-900/60 dark:via-slate-800/45 dark:to-sky-950/35 dark:shadow-black/10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="flex flex-col gap-4">
              <div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  aria-label="Back to locations"
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white/95 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 dark:border-sky-300/30 dark:bg-slate-900/40 dark:text-sky-200 dark:hover:bg-sky-500/10"
                >
                  <ArrowLeft size={18} />
                  Back to Locations
                </button>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-semibold leading-tight text-sky-700 dark:text-sky-300 sm:text-4xl">
                  {currentLocation?.name}
                </h2>
              </div>

              <div className="w-full max-w-xl rounded-2xl border border-slate-200/70 bg-white/75 p-2.5 shadow-md shadow-slate-200/40 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/35 dark:shadow-black/10">
                <div className="grid grid-cols-3 items-stretch gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => goToAdjacentLocation("previous")}
                    aria-label="Go to previous location"
                    className="inline-flex h-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-sky-300 bg-white px-2.5 py-2 text-xs font-semibold text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-300/30 dark:bg-slate-900/30 dark:text-sky-200 dark:hover:bg-sky-500/10 sm:px-3 sm:text-sm"
                    disabled={
                      cityLocations.length === 0 || currentLocationIndex === -1
                    }
                  >
                    <ChevronLeft size={16} />
                    <span className="sm:hidden">Prev</span>
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-xs font-semibold tracking-wide text-slate-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300 sm:text-sm">
                    {currentLocationIndex >= 0
                      ? `${currentLocationIndex + 1} / ${cityLocations.length}`
                      : `0 / ${cityLocations.length}`}
                  </span>

                  <button
                    type="button"
                    onClick={() => goToAdjacentLocation("next")}
                    aria-label="Go to next location"
                    className="inline-flex h-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-sky-300 bg-sky-600 px-2.5 py-2 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-300/30 sm:px-3 sm:text-sm"
                    disabled={
                      cityLocations.length === 0 || currentLocationIndex === -1
                    }
                  >
                    <span className="sm:hidden">Next</span>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-justify text-sm leading-8 text-slate-700 dark:text-slate-200/95 sm:text-base">
              {currentLocation?.description}
            </p>

            {currentLocation && (
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="relative">
                  {wishlistLocationIds.has(currentLocation.id) ? (
                    <div className="flex w-full overflow-visible rounded-2xl border border-pink-300 bg-pink-100 dark:border-pink-300/30 dark:bg-pink-500/12">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-pink-700 dark:text-pink-100"
                      >
                        <Heart size={15} fill="currentColor" />
                        In Wishlist
                        <Check size={15} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsWishlistDropdownOpen(!isWishlistDropdownOpen);
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center justify-center border-l border-pink-300 px-3 text-pink-700 transition hover:bg-pink-200 dark:border-pink-300/25 dark:text-pink-100 dark:hover:bg-pink-500/15"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isWishlistDropdownOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl dark:border-slate-700 dark:bg-gray-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLocationWishlist(currentLocation.id);
                              setIsWishlistDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Remove from Wishlist
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsWishlistDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleLocationWishlist(currentLocation.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-slate-50 dark:border-slate-200/20 dark:bg-white/8 dark:text-slate-100 dark:hover:border-sky-300/30 dark:hover:bg-white/12"
                    >
                      <Heart size={15} />
                      Add to Wishlist
                    </button>
                  )}
                </div>

                <div className="relative">
                  {travelHistoryLocationIds.has(currentLocation.id) ? (
                    <div className="flex w-full overflow-visible rounded-2xl border border-emerald-300 bg-emerald-100 dark:border-emerald-300/30 dark:bg-emerald-500/14">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-100"
                      >
                        <History size={15} fill="currentColor" />
                        Visited
                        <Check size={15} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsDropdownOpen(!isDropdownOpen);
                          setIsWishlistDropdownOpen(false);
                        }}
                        className="flex items-center justify-center border-l border-emerald-300 px-3 text-emerald-700 transition hover:bg-emerald-200 dark:border-emerald-300/25 dark:text-emerald-100 dark:hover:bg-emerald-500/18"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl dark:border-slate-700 dark:bg-gray-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLocationCollection(
                                currentLocation.id,
                                "travelHistory",
                              );
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Remove from Visited
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
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
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-slate-50 dark:border-slate-200/20 dark:bg-white/8 dark:text-slate-100 dark:hover:border-sky-300/30 dark:hover:bg-white/12"
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
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-white/10 dark:bg-white/6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-700 dark:text-slate-100/90">
                    Coordinates: {parsedLatitude.toFixed(6)},{" "}
                    {parsedLongitude.toFixed(6)}
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-sky-700 transition hover:text-sky-600 hover:underline dark:text-sky-300 dark:hover:text-sky-200"
                  >
                    Open in Google Maps
                  </a>
                </div>
                <iframe
                  title="Location map"
                  src={mapEmbedUrl}
                  className="h-84 w-full rounded-xl border border-slate-200 dark:border-white/12"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-200">
                Map unavailable: this location is missing valid
                latitude/longitude.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-center gap-2">
        <Camera className="text-sky-600" />
        <h2 className="text-3xl font-semibold text-sky-900 dark:text-sky-400">
          Location Images
        </h2>
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
            className="relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <button
              type="button"
              onClick={() => openExpandedImage(img.image_url)}
              aria-label="Expand image"
              className="absolute right-2 top-2 z-10 inline-flex items-center justify-center rounded-lg bg-black/55 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70"
            >
              <Maximize2 size={16} />
            </button>
            <img
              src={img.image_url}
              className="w-full h-full object-cover"
              alt="Location image"
            />
          </div>
        ))}
      </div>

      {expandedImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs"
          onClick={closeExpandedImage}
        >
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                decreaseZoom();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Zoom out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                increaseZoom();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Zoom in"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(1);
              }}
              className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Reset zoom"
            >
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeExpandedImage();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Close image viewer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const prevIndex =
                currentImageIndex === 0
                  ? filteredImages.length - 1
                  : currentImageIndex - 1;
              setCurrentImageIndex(prevIndex);
              setExpandedImageUrl(filteredImages[prevIndex].image_url);
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center rounded-lg bg-white/15 p-3 text-white shadow-md backdrop-blur-sm transition hover:bg-white/25 h-14 w-14"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const nextIndex =
                currentImageIndex === filteredImages.length - 1
                  ? 0
                  : currentImageIndex + 1;
              setCurrentImageIndex(nextIndex);
              setExpandedImageUrl(filteredImages[nextIndex].image_url);
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center rounded-lg bg-white/15 p-3 text-white shadow-md backdrop-blur-sm transition hover:bg-white/25 h-14 w-14"
          >
            <ChevronRight size={32} />
          </button>

          <div
            className="flex h-full w-full items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImageUrl}
              alt="Expanded location view"
              className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/50 px-3 py-1 text-xs text-white">
            {currentImageIndex + 1} / {filteredImages.length} • Zoom:{" "}
            {Math.round(zoomLevel * 100)}% (Arrow keys to navigate, Esc to
            close)
          </div>
        </div>
      )}

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
