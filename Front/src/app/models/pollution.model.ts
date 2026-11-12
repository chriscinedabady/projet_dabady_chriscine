export interface Pollution {
    id?: number | string,
    titre: string;
    type: string;
    description: string;
    dateObservation: string;
    lieu: string;
    latitude: number;
    longitude: number;
    photoUrl?: string; //'?' => champ optionnel
  }