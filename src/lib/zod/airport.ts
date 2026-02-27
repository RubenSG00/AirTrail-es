import { z } from 'zod';

import { AirportTypes, Continents } from '$lib/db/types';

export const airportSchema = z.object({
  id: z.number().nullable(),
  icao: z
    .string({ message: 'Establece un código' })
    .regex(/^[A-Z]{4}$/, 'El código debe ser 4 letras mayúsculas'),
  type: z
    .enum(AirportTypes, { message: 'Selecciona un tipo de aeropuerto' })
    // @ts-expect-error - z.enum always defaults to the first enum value, but we dont want a default
    .default(''),
  name: z.string().min(1, 'Establece un nombre'),
  municipality: z.string(),
  // @ts-expect-error - z.number always defaults to 0, but we dont want a default
  lat: z.number({ message: 'Establece la latitud' }).default(null),
  // @ts-expect-error - z.number always defaults to 0, but we dont want a default
  lon: z.number({ message: 'Establece la longitud' }).default(null),
  continent: z
    .enum(Continents, { message: 'Selecciona un continente' })
    // @ts-expect-error - z.enum always defaults to the first enum value, but we dont want a default
    .default(''),
  country: z.string().min(1, 'Selecciona un país'),
  iata: z.string(),
  tz: z
    .string({ message: 'Selecciona una zona horaria' })
    .regex(/^[a-zA-Z]+\/[a-zA-Z_]+$/, 'Debe ser un ID de zona horaria válido'),
});

/*
 * Only used inside the flight schema.
 */
export const flightAirportSchema = z.object({
  id: z.number(),
  type: z.enum(AirportTypes),
  name: z.string(),
  municipality: z.string().nullable().default(null),
  lat: z.number(),
  lon: z.number(),
  continent: z.enum(Continents),
  country: z.string(),
  icao: z.string(),
  iata: z.string().nullable(),
  tz: z.string(),
  custom: z.boolean(),
});

const yesNoBoolean = z.preprocess((val) => String(val) === 'yes', z.boolean());
export const airportSourceSchema = z.object({
  id: z.coerce.number(),
  ident: z.string(),
  type: z.enum(AirportTypes),
  name: z.string(),
  latitude_deg: z.coerce.number(),
  longitude_deg: z.coerce.number(),
  elevation_ft: z.coerce.number().nullable(),
  continent: z.enum(Continents),
  iso_country: z.string(),
  iso_region: z.string(),
  municipality: z.string().nullable(),
  scheduled_service: yesNoBoolean,
  gps_code: z.string().nullable(),
  iata_code: z.string(),
  local_code: z.string().nullable(),
  home_link: z.string().nullable(),
  wikipedia_link: z.string().nullable(),
  keywords: z.string().nullable(),
});
