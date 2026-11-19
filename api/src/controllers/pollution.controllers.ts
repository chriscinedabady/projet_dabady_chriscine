import { Request, Response } from "express";
import db from "../models";
import { handleNotFound, handleServerError } from "../utils/response";
import { validateIdParam, validatePollutionInput } from "../validators/pollution.validator";

const Pollutions = db.pollutions;

/**
 * Récupère la liste de toutes les pollutions depuis la base PostgreSQL.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    handleServerError(res, "la récupération des données de pollution", err);
  }
};

/**
 * Récupère une pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = validateIdParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "L'identifiant de la pollution doit être un entier positif." });
    return;
  }

  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      handleNotFound(res, "pollution", id);
    }
  } catch (err: unknown) {
    handleServerError(res, `la récupération de la pollution id=${id}`, err);
  }
};

/**
 * Crée une nouvelle pollution dans la base PostgreSQL.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  const validation = validatePollutionInput(req.body);
  if (!validation.isValid || !validation.data) {
    res.status(400).json({ message: validation.error });
    return;
  }

  try {
    const nouvellePollution = await Pollutions.create(validation.data);
    res.status(201).json(nouvellePollution);
  } catch (err: unknown) {
    handleServerError(res, "la création de la pollution", err);
  }
};

/**
 * Met à jour une pollution existante par son identifiant.
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  const id = validateIdParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "L'identifiant de la pollution doit être un entier positif." });
    return;
  }

  const validation = validatePollutionInput(req.body);
  if (!validation.isValid || !validation.data) {
    res.status(400).json({ message: validation.error });
    return;
  }

  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      handleNotFound(res, "pollution", id);
      return;
    }

    await pollution.update(validation.data);
    res.status(200).json(pollution);
  } catch (err: unknown) {
    handleServerError(res, `la mise à jour de la pollution id=${id}`, err);
  }
};

/**
 * Supprime une pollution par son identifiant.
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = validateIdParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "L'identifiant de la pollution doit être un entier positif." });
    return;
  }

  try {
    const deletedCount = await Pollutions.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      handleNotFound(res, "pollution", id);
      return;
    }
    res.status(200).json({
      message: "Pollution supprimée avec succès."
    });
  } catch (err: unknown) {
    handleServerError(res, `la suppression de la pollution id=${id}`, err);
  }
};

export default { getAll, getById, create, update, remove };
