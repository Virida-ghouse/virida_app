import { beforeEach, describe, expect, it, vi } from "vitest";
import { plantService } from "./plantService";

const apiFetchMock = vi.fn();

vi.mock("./apiConfig", async () => {
  const actual = await vi.importActual<typeof import("./apiConfig")>("./apiConfig");
  return {
    ...actual,
    apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  };
});

describe("plantService", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    apiFetchMock.mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) });
  });

  it("builds plants list endpoint with query params", async () => {
    await plantService.getPlants({ greenhouseId: "g1", status: "active", species: "tomato" });
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plants?greenhouseId=g1&status=active&species=tomato"
    );
  });

  it("uses plants endpoint without query params", async () => {
    await plantService.getPlants();
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plants");
  });

  it("calls plant CRUD endpoints", async () => {
    await plantService.getPlant("p1");
    await plantService.createPlant({ greenhouseId: "g1", name: "Basil" });
    await plantService.updatePlant("p1", { status: "healthy" });
    await plantService.deletePlant("p1");

    expect(apiFetchMock).toHaveBeenNthCalledWith(1, "/api/plants/p1");
    expect(apiFetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/plants",
      expect.objectContaining({ method: "POST" })
    );
    expect(apiFetchMock).toHaveBeenNthCalledWith(
      3,
      "/api/plants/p1",
      expect.objectContaining({ method: "PUT" })
    );
    expect(apiFetchMock).toHaveBeenNthCalledWith(
      4,
      "/api/plants/p1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("calls task endpoints", async () => {
    await plantService.getAllTasks({ plantId: "p1" });
    await plantService.getTaskById("t1");
    await plantService.createTask({ plantId: "p1", type: "water", description: "do it" });
    await plantService.updateTask("t1", { status: "done" });
    await plantService.completeTask("t1");
    await plantService.uncompleteTask("t1");
    await plantService.deleteTask("t1");

    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-tasks?plantId=p1");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-tasks/t1");
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-tasks",
      expect.objectContaining({ method: "POST" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-tasks/t1",
      expect.objectContaining({ method: "PUT" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-tasks/t1/complete",
      expect.objectContaining({ method: "PATCH" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-tasks/t1/uncomplete",
      expect.objectContaining({ method: "PATCH" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-tasks/t1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("uses tasks endpoint without query params", async () => {
    await plantService.getAllTasks();
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-tasks");
  });

  it("calls catalog endpoints", async () => {
    await plantService.getPlantCatalog({ category: "herb" });
    await plantService.getPlantCatalogItem("basil");
    await plantService.getPlantCatalogCategories();

    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-catalog?category=herb");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-catalog/basil");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-catalog/meta/categories");
  });

  it("uses catalog endpoint without filters", async () => {
    await plantService.getPlantCatalog();
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-catalog");
  });

  it("encodes plant name for RAG info endpoint", async () => {
    await plantService.getPlantInfo("Tomate Cerise");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plants/plant-info?plantName=Tomate%20Cerise");
  });

  it("calls harvest endpoints", async () => {
    await plantService.getHarvests("p1", { limit: "10", offset: "0" });
    await plantService.createHarvest("p1", { quantity: 3, quality: "good" });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/plants/p1/harvests?limit=10&offset=0");
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plants/p1/harvest",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("uses harvest endpoint without params", async () => {
    await plantService.getHarvests("p1");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plants/p1/harvests");
  });

  it("calls advanced photo and growth endpoints", async () => {
    await plantService.getPhotos("p1", { limit: "5", offset: "0" });
    await plantService.addPhotoByUrl("p1", { url: "https://img" });
    await plantService.deletePhoto("p1", "ph1");
    await plantService.getGrowthLogs("p1", { limit: "10" });
    await plantService.createGrowthLog("p1", { height: 12 });
    await plantService.deleteGrowthLog("p1", "g1");
    await plantService.getCareEvents("p1", { limit: "5", eventType: "watering" });
    await plantService.createCareEvent("p1", { eventType: "watering", amount: 1 });

    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-advanced/p1/photos?limit=5&offset=0");
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/photos",
      expect.objectContaining({ method: "POST" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/photos/ph1",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-advanced/p1/growth-logs?limit=10");
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/growth-logs",
      expect.objectContaining({ method: "POST" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/growth-logs/g1",
      expect.objectContaining({ method: "DELETE" })
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/care-events?limit=5&eventType=watering"
    );
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/care-events",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("uses advanced endpoints without query params", async () => {
    await plantService.getPhotos("p1");
    await plantService.getGrowthLogs("p1");
    await plantService.getCareEvents("p1");

    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-advanced/p1/photos");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-advanced/p1/growth-logs");
    expect(apiFetchMock).toHaveBeenCalledWith("/api/plant-advanced/p1/care-events");
  });

  it("uses multipart form-data upload endpoint with auth header", async () => {
    localStorage.setItem("virida_token", "token123");
    const file = new File(["data"], "photo.png", { type: "image/png" });

    await plantService.uploadPhoto("p1", file, "caption");

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/photos/upload",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer token123" },
      })
    );
  });

  it("uploads photo without auth header when no token exists", async () => {
    localStorage.removeItem("virida_token");
    const file = new File(["data"], "photo.png", { type: "image/png" });

    await plantService.uploadPhoto("p1", file);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "/api/plant-advanced/p1/photos/upload",
      expect.objectContaining({
        method: "POST",
        headers: {},
      })
    );
  });
});
