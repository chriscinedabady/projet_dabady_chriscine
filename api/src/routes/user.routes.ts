import { Application, Router } from "express";
import userController from "../controllers/user.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route GET /api/users (Liste des utilisateurs)
  router.get("/", userController.getAll);

  // Route POST /api/users (Créer un utilisateur)
  router.post("/", userController.create);

  // Route POST /api/users/login (Authentifier un utilisateur)
  router.post("/login", userController.login);

  // Route DELETE /api/users/:id (Supprimer un utilisateur)
  router.delete("/:id", userController.remove);

  // Exposition sous /api/users et /users
  app.use("/api/users", router);
  app.use("/users", router);
};

