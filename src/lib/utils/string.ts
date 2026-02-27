const spanishLabels: Record<string, string> = {
  // Roles
  admin: 'Administrador',
  user: 'Usuario',
  // Units
  metric: 'Métrico',
  imperial: 'Imperial',
  // Seat types
  window: 'Ventanilla',
  aisle: 'Pasillo',
  middle: 'Centro',
  pilot: 'Piloto',
  copilot: 'Copiloto',
  jumpseat: 'Asiento plegable',
  other: 'Otro',
  // Seat classes
  economy: 'Turista',
  'economy+': 'Turista+',
  business: 'Negocios',
  first: 'Primera',
  private: 'Privado',
  // Flight reasons
  leisure: 'Ocio',
  crew: 'Tripulación',
  // Country statuses
  visited: 'Visitado',
  lived: 'Vivido',
  wishlist: 'Deseo',
  layover: 'Escala',
  // Airport types
  small_airport: 'Aeropuerto pequeño',
  medium_airport: 'Aeropuerto mediano',
  large_airport: 'Aeropuerto grande',
  heliport: 'Helipuerto',
  balloonport: 'Puerto de globos',
  seaplane_base: 'Base de hidroaviones',
  closed: 'Cerrado',
};

export const toTitleCase = (str: string) => {
  const lower = str.toLowerCase();
  if (spanishLabels[lower]) return spanishLabels[lower];
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const snakeToTitleCase = (str: string) => {
  const lower = str.toLowerCase();
  if (spanishLabels[lower]) return spanishLabels[lower];
  return toTitleCase(str.replace(/_/g, ' '));
};

export const pluralize = (count: number, singular: string, plural?: string) => {
  return count === 1 ? singular : (plural ?? `${singular}s`);
};

export const quantify = (count: number, singular: string, plural?: string) => {
  return `${count} ${pluralize(count, singular, plural)}`;
};

export const leq = (a: string, b: string) => {
  return a.toLowerCase() === b.toLowerCase();
};

export const generateRandomString = (length: number = 12): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
};
