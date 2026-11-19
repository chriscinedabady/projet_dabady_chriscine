export const VALID_POLLUTION_TYPES = [
  "Plastique",
  "Chimique",
  "Dépôt sauvage",
  "Eau",
  "Air",
  "Autre"
] as const;

export interface ValidatedPollutionData {
  titre: string;
  type: string;
  description: string;
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
  dangerosite: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ValidatedPollutionData;
}

// Regex vérifiant strictement un format décimal (ex: 48, -48, 48.5839, -0.12). Rejette 1e2, Infinity, hex, etc.
const STRICT_DECIMAL_REGEX = /^-?\d+(\.\d+)?$/;

// Regex format ISO YYYY-MM-DD
const DATE_ISO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Valide et assainit les données d'une pollution pour la création ou la modification complète.
 */
export function validatePollutionInput(input: any): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { isValid: false, error: "Le corps de la requête doit être un objet JSON valide." };
  }

  // 1. Titre
  if (typeof input.titre !== "string" || input.titre.trim().length === 0) {
    return { isValid: false, error: "Le champ 'titre' est obligatoire et ne peut être vide." };
  }
  const titre = input.titre.trim();
  if (titre.length > 255) {
    return { isValid: false, error: "Le champ 'titre' ne doit pas dépasser 255 caractères." };
  }

  // 2. Type (validation par liste blanche)
  if (typeof input.type !== "string" || !VALID_POLLUTION_TYPES.includes(input.type as any)) {
    return {
      isValid: false,
      error: `Le champ 'type' est invalide. Valeurs autorisées : ${VALID_POLLUTION_TYPES.join(", ")}.`
    };
  }
  const type = input.type;

  // 3. Description
  if (typeof input.description !== "string" || input.description.trim().length === 0) {
    return { isValid: false, error: "Le champ 'description' est obligatoire et ne peut être vide." };
  }
  const description = input.description.trim();

  // 4. Lieu
  if (typeof input.lieu !== "string" || input.lieu.trim().length === 0) {
    return { isValid: false, error: "Le champ 'lieu' est obligatoire et ne peut être vide." };
  }
  const lieu = input.lieu.trim();
  if (lieu.length > 255) {
    return { isValid: false, error: "Le champ 'lieu' ne doit pas dépasser 255 caractères." };
  }

  // 5. Date d'observation (dateObservation ou date_observation)
  const rawDate = input.dateObservation ?? input.date_observation;
  if (typeof rawDate !== "string" || !DATE_ISO_REGEX.test(rawDate.trim())) {
    return { isValid: false, error: "Le champ 'dateObservation' doit être au format AAAA-MM-JJ (ex: 2026-11-18)." };
  }

  const dateObservation = rawDate.trim();
  const parsedDate = new Date(`${dateObservation}T00:00:00Z`);
  if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== dateObservation) {
    return { isValid: false, error: "La date d'observation fournie n'est pas une date calendrier valide." };
  }

  // Interdiction des dates dans le futur (référentiel Europe/Paris pour s'aligner avec le Front)
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

  if (dateObservation > today) {
    return { isValid: false, error: "La date d'observation ne peut pas être dans le futur." };
  }

  // 6. Latitude
  if (input.latitude === undefined || input.latitude === null || typeof input.latitude === "boolean") {
    return { isValid: false, error: "Le champ 'latitude' est obligatoire." };
  }
  const latStr = String(input.latitude).trim();
  if (!STRICT_DECIMAL_REGEX.test(latStr)) {
    return { isValid: false, error: "La latitude doit être un nombre décimal strict (ex: 48.5839)." };
  }
  const latitude = Number(latStr);
  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: "La latitude doit être comprise entre -90 et 90 degrés." };
  }

  // 7. Longitude
  if (input.longitude === undefined || input.longitude === null || typeof input.longitude === "boolean") {
    return { isValid: false, error: "Le champ 'longitude' est obligatoire." };
  }
  const lngStr = String(input.longitude).trim();
  if (!STRICT_DECIMAL_REGEX.test(lngStr)) {
    return { isValid: false, error: "La longitude doit être un nombre décimal strict (ex: 7.7455)." };
  }
  const longitude = Number(lngStr);
  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: "La longitude doit être comprise entre -180 et 180 degrés." };
  }

  // 8. Photo URL (optionnelle)
  let photoUrl: string | null = null;
  const rawPhoto = input.photoUrl ?? input.photo_url;
  if (rawPhoto !== undefined && rawPhoto !== null && String(rawPhoto).trim().length > 0) {
    const trimmedPhoto = String(rawPhoto).trim();
    try {
      const url = new URL(trimmedPhoto);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { isValid: false, error: "L'URL de la photo doit débuter par http:// ou https://." };
      }
      photoUrl = trimmedPhoto;
    } catch {
      return { isValid: false, error: "L'URL de la photo fournie n'est pas une URL valide." };
    }
  }

  // 9. Dangerosité (entier de 0 à 100)
  let dangerosite = 0;
  if (input.dangerosite !== undefined && input.dangerosite !== null) {
    const dangStr = String(input.dangerosite).trim();
    if (!/^\d+$/.test(dangStr)) {
      return { isValid: false, error: "La dangerosité doit être un nombre entier compris entre 0 et 100." };
    }
    const dangNum = Number(dangStr);
    if (dangNum < 0 || dangNum > 100) {
      return { isValid: false, error: "La dangerosité doit être comprise entre 0 et 100." };
    }
    dangerosite = dangNum;
  }

  return {
    isValid: true,
    data: {
      titre,
      type,
      description,
      dateObservation,
      lieu,
      latitude,
      longitude,
      photoUrl,
      dangerosite
    }
  };
}

/**
 * Valide qu'un identifiant passé en paramètre d'URL est un entier positif strict.
 */
export function validateIdParam(idParam: any): number | null {
  const str = Array.isArray(idParam) ? String(idParam[0]) : String(idParam);
  if (!/^\d+$/.test(str)) {
    return null;
  }
  const id = Number(str);
  return id > 0 ? id : null;
}
