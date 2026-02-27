import { actionResult, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { RequestHandler } from './$types';

import { db } from '$lib/db';
import { usernameExists } from '$lib/server/utils/auth';
import { adminEditUserSchema } from '$lib/zod/user';

type PermissionError = { message: string; status: number };

const checkAdminPermissions = (
  user: App.Locals['user'],
  targetUser: { role: string },
): PermissionError | null => {
  if (!user) {
    return { message: 'Debes iniciar sesión para editar usuarios.', status: 401 };
  }
  if (user.role === 'user') {
    return { message: 'Debes ser administrador para editar usuarios.', status: 403 };
  }
  if (targetUser.role === 'owner') {
    return { message: 'No se puede editar al propietario.', status: 403 };
  }
  if (targetUser.role === 'admin' && user.role === 'admin') {
    return { message: 'Los administradores no pueden editar a otros administradores.', status: 403 };
  }
  return null;
};

const getChangedFields = <T extends Record<string, unknown>>(
  newValues: T,
  currentValues: Record<string, unknown>,
): Partial<T> => {
  const keys = Object.keys(newValues) as (keyof T)[];
  return keys.reduce<Partial<T>>((changes, key) => {
    if (newValues[key] !== currentValues[key as string]) {
      changes[key] = newValues[key];
    }
    return changes;
  }, {});
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const form = await superValidate(request, zod(adminEditUserSchema));
  if (!form.valid) return actionResult('failure', { form });

  const { id: userId, username, displayName, unit, role } = form.data;

  const targetUser = await db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', userId)
    .executeTakeFirst();

  if (!targetUser) {
    return actionResult('error', 'Usuario no encontrado.', 404);
  }

  const permissionError = checkAdminPermissions(locals.user, targetUser);
  if (permissionError) {
    return actionResult(
      'error',
      permissionError.message,
      permissionError.status,
    );
  }

  const updatedFields = getChangedFields(
    { username, displayName, unit, role },
    targetUser,
  );

  if (Object.keys(updatedFields).length === 0) {
    form.message = { type: 'error', text: 'No se realizaron cambios' };
    return actionResult('success', { form });
  }

  if (updatedFields.username) {
    const exists = await usernameExists(updatedFields.username);
    if (exists) {
      setError(form, 'username', 'El nombre de usuario ya existe');
      return actionResult('failure', { form });
    }
  }

  const resp = await db
    .updateTable('user')
    .set(updatedFields)
    .where('id', '=', userId)
    .executeTakeFirst();

  if (!resp.numUpdatedRows) {
    form.message = { type: 'error', text: 'Error al editar usuario' };
    return actionResult('failure', { form });
  }

  form.message = { type: 'success', text: 'Usuario actualizado' };
  return actionResult('success', { form });
};
