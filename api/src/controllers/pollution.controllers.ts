import { Request, Response } from "express";
import db from "../models";

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
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de pollution: " + message
    });
  }
};

/**
 * Récupère une pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de la pollution id=${id}: ` + message
    });
  }
};

/**
 * Crée une nouvelle pollution dans la base PostgreSQL.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      titre,
      type,
      description,
      dateObservation,
      date_observation,
      lieu,
      latitude,
      longitude,
      photoUrl,
      photo_url
    } = req.body;

    const nouvellePollution = await Pollutions.create({
      titre,
      type,
      description,
      dateObservation: dateObservation ?? date_observation,
      lieu,
      latitude: Number(latitude),
      longitude: Number(longitude),
      photoUrl: photoUrl ?? photo_url ?? null
    });

    res.status(201).json(nouvellePollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la création de la pollution: " + message
    });
  }
};

/**
 * Met à jour une pollution existante par son identifiant.
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
      return;
    }

    const {
      titre,
      type,
      description,
      dateObservation,
      date_observation,
      lieu,
      latitude,
      longitude,
      photoUrl,
      photo_url
    } = req.body;

    await pollution.update({
      titre: titre ?? pollution.titre,
      type: type ?? pollution.type,
      description: description ?? pollution.description,
      dateObservation: dateObservation ?? date_observation ?? pollution.dateObservation,
      lieu: lieu ?? pollution.lieu,
      latitude: latitude !== undefined ? Number(latitude) : pollution.latitude,
      longitude: longitude !== undefined ? Number(longitude) : pollution.longitude,
      photoUrl: photoUrl !== undefined ? photoUrl : (photo_url !== undefined ? photo_url : pollution.photoUrl)
    });

    res.status(200).json(pollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la mise à jour de la pollution id=${id}: ` + message
    });
  }
};

/**
 * Supprime une pollution par son identifiant.
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? Number(paramId[0]) : Number(paramId);
  try {
    const deletedCount = await Pollutions.destroy({
      where: { id }
    });
    if (deletedCount === 0) {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
      return;
    }
    res.status(200).json({
      message: "Pollution supprimée avec succès."
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la suppression de la pollution id=${id}: ` + message
    });
  }
};

export default { getAll, getById, create, update, remove };
