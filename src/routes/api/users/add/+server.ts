import { generateId } from 'lucia';
import { actionResult, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { RequestHandler } from './$types';

import { createUser, usernameExists } from '$lib/server/utils/auth';
import { hashArgon2 } from '$lib/server/utils/hash';
import { addUserSchema } from '$lib/zod/user';

export const POST: RequestHandler = async ({ locals, request }) => {
  const form = await superValidate(request, zod(addUserSchema));
  if (!form.valid) return actionResult('failure', { form });

  const user = locals.user;
  if (!user) {
    return actionResult('error', 'Debes iniciar sesión para crear usuarios.', 401);
  }
  if (user.role === 'user') {
    return actionResult('error', 'Debes ser administrador para crear usuarios.', 403);
  }

  const { username, password, displayName, unit, role } = form.data;

  const exists = await usernameExists(username);
  if (exists) {
    setError(form, 'username', 'El nombre de usuario ya existe');
    return actionResult('failure', { form });
  }

  const userId = generateId(15);
  const passwordHash = await hashArgon2(password);

  const success = await createUser(
    userId,
    username,
    passwordHash,
    displayName,
    unit,
    role,
  );
  if (!success) {
    form.message = { type: 'error', text: 'Error al crear usuario' };
    return actionResult('failure', { form });
  }

  form.message = { type: 'success', text: 'Usuario creado' };
  return actionResult('success', { form });
};
