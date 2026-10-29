import { Application, Router } from "express";
import pollutionController from "../controllers/pollution.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route GET /api/pollutions
  router.get("/", pollutionController.getAll);

  // Route GET /api/pollutions/:id
  router.get("/:id", pollutionController.getById);

  // Route POST /api/pollutions
  router.post("/", pollutionController.create);

  // Route PUT /api/pollutions/:id
  router.put("/:id", pollutionController.update);

  // Route DELETE /api/pollutions/:id
  router.delete("/:id", pollutionController.remove);

  // Exposition sous /api/pollutions, /api/pollution et /pollutions (pour compatibilité directe avec le Front)
  app.use("/api/pollutions", router);
  app.use("/api/pollution", router);
  app.use("/pollutions", router);
};

