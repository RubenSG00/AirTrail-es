import { z } from 'zod';

export const baseShareSchema = z.object({
  showMap: z.boolean().default(true),
  showStats: z.boolean().default(false),
  showFlightList: z.boolean().default(false),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  showFlightNumbers: z.boolean().default(true),
  showAirlines: z.boolean().default(true),
  showAircraft: z.boolean().default(false),
  showTimes: z.boolean().default(false),
  showDates: z.boolean().default(true),
  showSeat: z.boolean().default(false),
});

export const shareSchema = z
  .object({
    id: z.number().optional(),
    slug: z
      .string()
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'La URL del compartido solo puede contener letras, números, guiones y guiones bajos',
      )
      .min(1, 'La URL del compartido es obligatoria')
      .max(50, 'La URL del compartido debe tener 50 caracteres o menos'),
    expiresAt: z.string().optional(),
    expiryOption: z
      .enum(['never', '1day', '1week', '1month', '3months', 'custom'])
      .default('never'),
  })
  .merge(baseShareSchema);
