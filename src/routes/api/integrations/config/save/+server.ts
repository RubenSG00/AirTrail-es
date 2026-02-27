import { error } from '@sveltejs/kit';
import { actionResult, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { RequestHandler } from './$types';

import { appConfig } from '$lib/server/utils/config';
import { integrationsConfigSchema } from '$lib/zod/config';

export const POST: RequestHandler = async ({ locals, request }) => {
  const form = await superValidate(request, zod(integrationsConfigSchema));
  if (!form.valid) return actionResult('failure', { form });

  const user = locals.user;
  if (!user || user.role === 'user') {
    return actionResult('error', 'No autorizado', 401);
  }

  const currentConfig = (await appConfig.get())?.integrations;
  let { aeroDataBoxKey } = form.data;
  if (typeof aeroDataBoxKey === 'string' && aeroDataBoxKey.trim() === '') {
    aeroDataBoxKey = null;
  }

  if (
    currentConfig &&
    aeroDataBoxKey !== currentConfig.aeroDataBoxKey &&
    appConfig.envConfigured?.integrations?.aeroDataBoxKey
  ) {
    return error(500, {
      message:
        'Este campo de configuración está controlado por el archivo .env y no se puede cambiar aquí.',
    });
  }

  const success = await appConfig.set({ integrations: { aeroDataBoxKey } });

  if (!success) {
    form.message = {
      type: 'error',
      text: 'Error al actualizar la configuración de integraciones',
    };
    return actionResult('failure', { form });
  }

  form.message = { type: 'success', text: 'Configuración de integraciones actualizada' };
  return actionResult('success', { form });
};
