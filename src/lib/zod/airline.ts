import { z } from 'zod';

export const airlineSchema = z.object({
  id: z.number().nullable(),
  name: z.string().min(1, 'El nombre de la aerolínea es obligatorio'),
  icao: z
    .string({ message: 'Establece un código ICAO' })
    .max(3, 'El código ICAO debe tener 3 caracteres o menos')
    .regex(
      /^[A-Z0-9]+$/,
      'El código ICAO solo puede contener letras mayúsculas y números',
    )
    .nullable(),
  iata: z
    .string({ message: 'Establece un código IATA' })
    .max(3, 'El código IATA debe ser un código de 2 letras, opcionalmente seguido de *')
    .regex(
      /^[A-Z0-9]{2}\*?$/,
      'El código IATA debe ser 2 letras/números mayúsculas, opcionalmente seguido de * para duplicados controlados',
    )
    .nullable(),
  iconPath: z.string().nullable().optional(),
  sourceId: z.string().nullable().optional(),
});
