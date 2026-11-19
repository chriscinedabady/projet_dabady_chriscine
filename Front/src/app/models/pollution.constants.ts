export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre'
] as const;

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

export const POLLUTION_LEVEL_COLORS: Record<PollutionLevel, string> = {
  Faible: '#d4edda',      // Vert clair
  Modérée: '#fff3cd',     // Jaune
  Élevée: '#ffe5d0',      // Orange
  Dangereuse: '#f8d7da'   // Rouge
};

/**
 * Calcule le niveau textuel de dangerosité sur une échelle de 0 à 100.
 */
export function getPollutionLevel(indice: number): PollutionLevel {
  if (indice <= 20) return 'Faible';
  if (indice <= 50) return 'Modérée';
  if (indice <= 80) return 'Élevée';
  return 'Dangereuse';
}

/**
 * Retourne la couleur associée à un indice (0-100) ou à un niveau textuel.
 */
export function getPollutionColor(value: number | string): string {
  if (typeof value === 'number') {
    return POLLUTION_LEVEL_COLORS[getPollutionLevel(value)];
  }
  const normalized = value.trim().toLowerCase();
  const match = (Object.keys(POLLUTION_LEVEL_COLORS) as PollutionLevel[]).find(
    (level) => level.toLowerCase() === normalized
  );
  return match ? POLLUTION_LEVEL_COLORS[match] : '';
}
