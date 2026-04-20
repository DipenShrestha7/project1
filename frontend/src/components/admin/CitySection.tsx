import type { UseAdminPanelState } from "./useAdminPanel";
import { Button, Container, DataPanel, Input } from "./ui";

export function CitySection({ admin }: { admin: UseAdminPanelState }) {
  return (
    <>
      <h2 className="mb-3 text-xl font-semibold text-cyan-100">City</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Container title="Add City">
          <Input
            placeholder="City Name"
            value={admin.cityName}
            onChange={admin.setCityName}
          />
          <Input
            placeholder="Description"
            value={admin.cityDescription}
            onChange={admin.setCityDescription}
          />
          <Button
            text="Add City"
            onClick={admin.handleAddCity}
            color="success"
          />
        </Container>

        <Container title="Update City">
          <Input
            placeholder="City ID"
            value={admin.updateCityId}
            onChange={admin.setUpdateCityId}
          />
          <Input
            placeholder="New Name"
            value={admin.updateCityName}
            onChange={admin.setUpdateCityName}
          />
          <Input
            placeholder="New Description"
            value={admin.updateCityDescription}
            onChange={admin.setUpdateCityDescription}
          />
          <Button
            text="Update City"
            onClick={admin.handleUpdateCity}
            color="warning"
          />
        </Container>

        <Container title="Delete City">
          <Input
            placeholder="City ID"
            value={admin.deleteCityId}
            onChange={admin.setDeleteCityId}
          />
          <Button
            text="Delete City"
            onClick={admin.handleDeleteCity}
            color="danger"
          />
        </Container>

        <Container title="Find City">
          <div className="mb-3">
            <Button
              text="Fetch All Cities"
              onClick={admin.handleGetAllCities}
              color="primary"
            />
          </div>
          <Input
            placeholder="City ID"
            value={admin.searchCityId}
            onChange={admin.setSearchCityId}
          />
          <Input
            placeholder="City Name"
            value={admin.searchCityName}
            onChange={admin.setSearchCityName}
          />
          <Button
            text="Fetch City"
            onClick={admin.handleGetCity}
            color="primary"
          />
        </Container>
      </div>

      {(admin.fetchedCity || admin.allCities.length > 0) && (
        <DataPanel title="City Results">
          {admin.fetchedCity && (
            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-slate-900/80 p-4 text-sm">
              <p>
                <span className="font-semibold text-cyan-200">City ID:</span>{" "}
                {admin.fetchedCity.city_id}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">Name:</span>{" "}
                {admin.fetchedCity.city_name}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">
                  Description:
                </span>{" "}
                {admin.fetchedCity.description || "-"}
              </p>
            </div>
          )}

          {admin.allCities.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left">City ID</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.allCities.map((city) => (
                    <tr
                      key={city.city_id}
                      className="border-t border-slate-800 align-top"
                    >
                      <td className="px-3 py-2">{city.city_id}</td>
                      <td className="px-3 py-2 capitalize">{city.city_name}</td>
                      <td className="px-3 py-2">{city.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataPanel>
      )}
    </>
  );
}
