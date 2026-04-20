import type { UseAdminPanelState } from "./useAdminPanel";
import { Button, Container, DataPanel, Input } from "./ui";

export function LocationSection({ admin }: { admin: UseAdminPanelState }) {
  return (
    <>
      <h2 className="mb-3 text-xl font-semibold text-cyan-100">Location</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Container title="Add Location">
          <Input
            placeholder="Location Name"
            value={admin.locationName}
            onChange={admin.setLocationName}
          />
          <Input
            placeholder="Description"
            value={admin.locationDescription}
            onChange={admin.setLocationDescription}
          />
          <Input
            placeholder="City ID"
            value={admin.locationCityId}
            onChange={admin.setLocationCityId}
          />
          <Input
            placeholder="Latitude"
            value={admin.latitude}
            onChange={admin.setLatitude}
          />
          <Input
            placeholder="Longitude"
            value={admin.longitude}
            onChange={admin.setLongitude}
          />
          <Button
            text="Add Location"
            onClick={admin.handleAddLocation}
            color="success"
          />
        </Container>

        <Container title="Update Location">
          <Input
            placeholder="Location ID"
            value={admin.updateLocationId}
            onChange={admin.setUpdateLocationId}
          />
          <Input
            placeholder="New Name"
            value={admin.updateLocationName}
            onChange={admin.setUpdateLocationName}
          />
          <Input
            placeholder="New Description"
            value={admin.updateLocationDescription}
            onChange={admin.setUpdateLocationDescription}
          />
          <Input
            placeholder="New Latitude"
            value={admin.updateLatitude}
            onChange={admin.setUpdateLatitude}
          />
          <Input
            placeholder="New Longitude"
            value={admin.updateLongitude}
            onChange={admin.setUpdateLongitude}
          />
          <Button
            text="Update Location"
            onClick={admin.handleUpdateLocation}
            color="warning"
          />
        </Container>

        <Container title="Delete Location">
          <Input
            placeholder="Location ID"
            value={admin.deleteLocationId}
            onChange={admin.setDeleteLocationId}
          />
          <Button
            text="Delete Location"
            onClick={admin.handleDeleteLocation}
            color="danger"
          />
        </Container>

        <Container title="Find Location">
          <div className="mb-3">
            <Button
              text="Fetch All Locations"
              onClick={admin.handleGetAllLocations}
              color="primary"
            />
          </div>
          <Input
            placeholder="Location ID"
            value={admin.searchLocationId}
            onChange={admin.setSearchLocationId}
          />
          <Input
            placeholder="Location Name"
            value={admin.searchLocationName}
            onChange={admin.setSearchLocationName}
          />
          <Input
            placeholder="City ID (for list)"
            value={admin.searchLocationCityId}
            onChange={admin.setSearchLocationCityId}
          />
          <Button
            text="Fetch Location"
            onClick={admin.handleGetLocation}
            color="primary"
          />
        </Container>
      </div>

      {(admin.fetchedLocation ||
        admin.fetchedLocationsByCity ||
        admin.allLocations.length > 0) && (
        <DataPanel title="Location Results">
          {admin.fetchedLocation && (
            <div className="mb-4 grid gap-2 rounded-lg border border-cyan-500/30 bg-slate-900/80 p-4 text-sm md:grid-cols-2">
              <p>
                <span className="font-semibold text-cyan-200">
                  Location ID:
                </span>{" "}
                {admin.fetchedLocation.location_id}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">City ID:</span>{" "}
                {admin.fetchedLocation.city_id}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">Name:</span>{" "}
                {admin.fetchedLocation.location_name}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">Latitude:</span>{" "}
                {admin.fetchedLocation.latitude ?? "-"}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">Longitude:</span>{" "}
                {admin.fetchedLocation.longitude ?? "-"}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">
                  Description:
                </span>{" "}
                {admin.fetchedLocation.description || "-"}
              </p>
            </div>
          )}

          {admin.fetchedLocationsByCity && (
            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-slate-900/80 p-4">
              <p className="text-sm font-semibold text-cyan-200">
                Locations for City ID {admin.searchLocationCityId} (
                {admin.fetchedLocationsByCity.length})
              </p>
            </div>
          )}

          {(admin.fetchedLocationsByCity || admin.allLocations.length > 0) && (
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Location ID</th>
                    <th className="px-3 py-2 text-left">City ID</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Latitude</th>
                    <th className="px-3 py-2 text-left">Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {(admin.fetchedLocationsByCity ?? admin.allLocations).map(
                    (location) => (
                      <tr
                        key={location.location_id}
                        className="border-t border-slate-800 align-top"
                      >
                        <td className="px-3 py-2">{location.location_id}</td>
                        <td className="px-3 py-2">{location.city_id}</td>
                        <td className="px-3 py-2">{location.location_name}</td>
                        <td className="px-3 py-2">
                          {location.description || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {location.latitude ?? "-"}
                        </td>
                        <td className="px-3 py-2">
                          {location.longitude ?? "-"}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DataPanel>
      )}
    </>
  );
}
