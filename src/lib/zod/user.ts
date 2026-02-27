import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede tener más de 20 caracteres' })
    .regex(/^\w+$/, {
      message: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
    }),
  password: z.string().min(8),
  displayName: z.string().min(3),
  unit: z
    .enum(['imperial', 'metric'], { message: 'Seleccionar unidad' })
    .default('metric'),
  role: z.enum(['user', 'admin']).default('user'),
});

export const editUserSchema = userSchema.omit({ password: true, role: true });
export const adminEditUserSchema = userSchema
  .omit({ password: true })
  .extend({ id: z.string() });
export const editPasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    newPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .superRefine(({ currentPassword, newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
    }
    if (newPassword && currentPassword === newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La nueva contraseña debe ser diferente de la actual',
        path: ['newPassword'],
      });
    }
  });

export const addUserSchema = userSchema;

export const createApiKeySchema = z.object({
  name: z.string(),
});
