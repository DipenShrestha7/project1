const fs = require('fs');

const path = 'c:\\Coding\\Backend Basics\\Fastify\\my-project\\frontend\\src\\pages\\Dashboard.tsx';
const file = fs.readFileSync(path, 'utf-8');

// 1. Replace imports and types
let modified = file.replace(/import \{([\s\S]*?)\} from "lucide-react";\s*import \{ useNavigate \} from "react-router-dom";[\s\S]*?type ActiveSection[\s\S]*?;/,
`import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User, WishlistItem, City, Cities, Location, Locations, Image, Images, HistoryItem, ActiveSection } from "../components/dashboard/types";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import CitiesView from "../components/dashboard/CitiesView";
import WishlistView from "../components/dashboard/WishlistView";
import TravelHistoryView from "../components/dashboard/TravelHistoryView";
import LocationDetailsView from "../components/dashboard/LocationDetailsView";`);

// 2. Replace the return block
const returnReplacement = `  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-slate-200 transition-colors">
      <DashboardSidebar
        User={User}
        preview={preview}
        handleFile={handleFile}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        filteredCities={filteredCities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setSelectedLocation={setSelectedLocation}
        wishlistCityIds={wishlistCityIds}
        toggleCityWishlist={toggleCityWishlist}
      />

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        {/* No city selected */}
        {activeSection === "cities" && !selectedCity && (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400 text-xl">
            Select a city to explore locations
          </div>
        )}

        {/* City selected but no location selected */}
        {activeSection === "cities" && selectedCity && !selectedLocation && (
          <CitiesView
            currentCity={currentCity}
            filteredLocations={filteredLocations}
            setSelectedLocation={setSelectedLocation}
            wishlistLocationIds={wishlistLocationIds}
            toggleLocationWishlist={toggleLocationWishlist}
            travelHistoryLocationIds={travelHistoryLocationIds}
            toggleLocationCollection={toggleLocationCollection}
          />
        )}

        {activeSection === "wishlist" && (
          <WishlistView
            wishlistCities={wishlistCities}
            wishlistLocations={wishlistLocations}
            setActiveSection={setActiveSection}
            setSelectedCity={setSelectedCity}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {activeSection === "travelHistory" && (
          <TravelHistoryView
            travelHistoryItems={travelHistoryItems}
            Locations={Locations}
            expandedReviewLocationIds={expandedReviewLocationIds}
            toggleReviewSection={toggleReviewSection}
            reviewTextDrafts={reviewTextDrafts}
            setReviewTextDrafts={setReviewTextDrafts}
            ratingDrafts={ratingDrafts}
            setRatingDrafts={setRatingDrafts}
            savingReviewLocationId={savingReviewLocationId}
            saveReviewForLocation={saveReviewForLocation}
            setActiveSection={setActiveSection}
            setSelectedCity={setSelectedCity}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {/* Location selected */}
        {activeSection === "cities" && selectedLocation && (
          <LocationDetailsView
            currentLocation={currentLocation}
            parsedLatitude={parsedLatitude}
            parsedLongitude={parsedLongitude}
            hasValidCoordinates={hasValidCoordinates}
            googleMapsUrl={googleMapsUrl}
            mapEmbedUrl={mapEmbedUrl}
            wishlistLocationIds={wishlistLocationIds}
            toggleLocationWishlist={toggleLocationWishlist}
            travelHistoryLocationIds={travelHistoryLocationIds}
            toggleLocationCollection={toggleLocationCollection}
            filteredImages={filteredImages}
            flippedImageIds={flippedImageIds}
            setFlippedImageIds={setFlippedImageIds}
            setSelectedLocation={setSelectedLocation}
          />
        )}
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => {
          setHasUserThemePreference(true);
          setDarkMode((prev) => !prev);
        }}
        className="fixed bottom-6 left-6 p-3 bg-sky-600 text-white rounded-full shadow-lg hover:bg-sky-700 transition z-50"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <button
        onClick={() => {
          LogOut();
        }}
        className="fixed bottom-6 left-40 px-3 py-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition z-50"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
`;

const updated = modified.replace(/  return \(\s*<div className="min-h-screen[\s\S]*export default Dashboard;/m, returnReplacement);

if (updated !== file) {
    fs.writeFileSync(path, updated);
    console.log('Update complete!');
} else {
    console.log('No replacement made - regex might have missed.');
}
