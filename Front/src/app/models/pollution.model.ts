export interface Pollution {
  id?: number;
  titre: string;
  type: string;
  description: string;
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string | null;
  dangerosite: number;
}
