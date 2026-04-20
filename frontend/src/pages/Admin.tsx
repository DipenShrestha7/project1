import { CitySection } from "../components/admin/CitySection";
import { ImageSection } from "../components/admin/ImageSection";
import { LocationSection } from "../components/admin/LocationSection";
import { ReportsSection } from "../components/admin/ReportsSection";
import { useAdminPanel } from "../components/admin/useAdminPanel";
import { NotificationToast } from "../components/admin/ui";

export default function Admin() {
  const admin = useAdminPanel();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-8 text-white md:px-8">
      {admin.notification && (
        <NotificationToast
          type={admin.notification.type}
          message={admin.notification.message}
          onClose={() => admin.setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-cyan-100 md:text-4xl">
            Admin Data Console
          </h1>
          <p className="mt-2 text-sm text-slate-300 md:text-base">
            Manage cities, locations, images, and reports with clear fetch
            results. You can now fetch locations by City ID and images by
            Location ID directly.
          </p>
        </div>

        <CitySection admin={admin} />
        <LocationSection admin={admin} />
        <ImageSection admin={admin} />
        <ReportsSection admin={admin} />
      </div>
    </div>
  );
}
