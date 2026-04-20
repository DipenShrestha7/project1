import type { UseAdminPanelState } from "./useAdminPanel";
import { Button, Container, DataPanel, Input } from "./ui";

export function ImageSection({ admin }: { admin: UseAdminPanelState }) {
  return (
    <>
      <h2 className="mb-3 text-xl font-semibold text-cyan-100">Image</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Container title="Add Image">
          <Input
            placeholder="Location ID"
            value={admin.imageLocationId}
            onChange={admin.setImageLocationId}
          />
          <input
            id="imageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                admin.setImageFile(e.target.files[0]);
              }
            }}
            className="mb-3 w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-950/80 p-2 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
          />
          <Button
            text="Add Image"
            onClick={admin.handleAddImage}
            color="success"
          />
          {admin.imageInlineStatus && (
            <p
              className={`mt-2 text-sm ${
                admin.imageInlineStatus.type === "success"
                  ? "text-emerald-300"
                  : admin.imageInlineStatus.type === "error"
                    ? "text-red-300"
                    : "text-cyan-300"
              }`}
            >
              {admin.imageInlineStatus.message}
            </p>
          )}
        </Container>

        <Container title="Update Image">
          <Input
            placeholder="Image ID"
            value={admin.updateImageId}
            onChange={admin.setUpdateImageId}
          />
          <input
            id="updateImageFileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                admin.setUpdateImageFile(e.target.files[0]);
              }
            }}
            className="mb-3 w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-950/80 p-2 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-700"
          />
          <Button
            text="Update Image"
            onClick={admin.handleUpdateImage}
            color="warning"
          />
        </Container>

        <Container title="Delete Image">
          <Input
            placeholder="Image ID"
            value={admin.deleteImageId}
            onChange={admin.setDeleteImageId}
          />
          <Button
            text="Delete Image"
            onClick={admin.handleDeleteImage}
            color="danger"
          />
        </Container>

        <Container title="Find Image">
          <div className="mb-3">
            <Button
              text="Fetch All Images"
              onClick={admin.handleGetAllImages}
              color="primary"
            />
          </div>
          <Input
            placeholder="Image ID"
            value={admin.searchImageId}
            onChange={admin.setSearchImageId}
          />
          <Input
            placeholder="Location ID (for list)"
            value={admin.searchImageLocationId}
            onChange={admin.setSearchImageLocationId}
          />
          <Button
            text="Fetch Image(s)"
            onClick={admin.handleGetImage}
            color="primary"
          />
        </Container>
      </div>

      {(admin.fetchedImage ||
        admin.fetchedImages ||
        admin.allImages.length > 0) && (
        <DataPanel title="Image Results">
          {admin.fetchedImage && (
            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-slate-900/80 p-4 text-sm">
              <p>
                <span className="font-semibold text-cyan-200">Image ID:</span>{" "}
                {admin.fetchedImage.image_id}
              </p>
              <p>
                <span className="font-semibold text-cyan-200">
                  Location ID:
                </span>{" "}
                {admin.fetchedImage.location_id}
              </p>
              <p className="truncate">
                <span className="font-semibold text-cyan-200">URL:</span>{" "}
                {admin.fetchedImage.image_url}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(admin.fetchedImages ?? admin.allImages).map((image) => (
              <div
                key={image.image_id}
                className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/90"
              >
                <img
                  src={image.image_url}
                  alt={`Location ${image.location_id} image ${image.image_id}`}
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-1 p-3 text-sm">
                  <p>
                    <span className="font-semibold text-cyan-200">
                      Image ID:
                    </span>{" "}
                    {image.image_id}
                  </p>
                  <p>
                    <span className="font-semibold text-cyan-200">
                      Location ID:
                    </span>{" "}
                    {image.location_id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      )}
    </>
  );
}
