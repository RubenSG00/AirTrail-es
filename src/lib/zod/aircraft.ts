import { z } from 'zod';

export const aircraftSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1, 'El nombre de la aeronave es obligatorio'),
  icao: z
    .string({ message: 'Establece un código ICAO' })
    .max(4, 'El código ICAO debe tener 4 caracteres o menos')
    .regex(
      /^[A-Z0-9]+$/,
      'El código ICAO solo puede contener letras mayúsculas y números',
    )
    .nullable(),
});
