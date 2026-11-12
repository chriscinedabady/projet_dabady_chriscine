import { Request, Response } from "express";
import db from "../models";

const Users = db.users;

/**
 * Récupère la liste de tous les utilisateurs (GET /api/users).
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Users.findAll({
      attributes: ["id", "username", "email"],
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs: " + message
    });
  }
};

/**
 * Crée un nouvel utilisateur (POST /api/users).
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Les champs username, email et password sont obligatoires."
      });
      return;
    }

    const nouvelUtilisateur = await Users.create({
      username,
      email,
      password
    });

    res.status(201).json({
      id: nouvelUtilisateur.id,
      username: nouvelUtilisateur.username,
      email: nouvelUtilisateur.email
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur: " + message
    });
  }
};

/**
 * Supprime un utilisateur par son identifiant (DELETE /api/users/:id).
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const deletedCount = await Users.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      res.status(404).json({
        message: `Aucun utilisateur trouvé avec l'id=${id}.`
      });
      return;
    }
    res.status(200).json({
      message: "Utilisateur supprimé avec succès."
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la suppression de l'utilisateur id=${id}: ` + message
    });
  }
};

export default { getAll, create, remove };

