import { Response } from "express";

/**
 * Log l'erreur technique côté serveur et renvoie un message 500 propre et sécurisé au client.
 */
export const handleServerError = (
  res: Response,
  action: string,
  error: unknown
): void => {
  console.error(`Erreur serveur lors de ${action} :`, error);
  res.status(500).json({
    message: `Erreur interne du serveur lors de ${action}.`
  });
};

/**
 * Renvoie une réponse 404 standardisée lorsqu'une ressource n'est pas trouvée.
 */
export const handleNotFound = (
  res: Response,
  entityName: string,
  id: number | string
): void => {
  res.status(404).json({
    message: `Aucun(e) ${entityName} trouvé(e) avec l'id=${id}.`
  });
};
