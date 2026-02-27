import { error } from '@sveltejs/kit';
import { actionResult, type Infer, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { RequestHandler } from './$types';

import { appConfig } from '$lib/server/utils/config';
import { oauthConfigSchema } from '$lib/zod/config';

export const POST: RequestHandler = async ({ locals, request }) => {
  const form = await superValidate(request, zod(oauthConfigSchema));
  if (!form.valid) return actionResult('failure', { form });

  const user = locals.user;
  if (!user || user.role === 'user') {
    return actionResult('error', 'No autorizado', 401);
  }

  const currentConfig = (await appConfig.get())?.oauth;
  const data: Partial<Infer<typeof oauthConfigSchema>> = form.data;

  // Don't overwrite clientSecret if it's not provided
  if (!data.clientSecret && currentConfig) {
    data.clientSecret = undefined;
  }

  for (const key in data) {
    if (
      currentConfig &&
      !(!data.clientSecret && key === 'clientSecret') &&
      data[key as keyof typeof data] !==
        currentConfig[key as keyof typeof currentConfig]
    ) {
      if (!appConfig.envConfigured?.oauth?.[key as keyof typeof currentConfig])
        continue;
      return error(500, {
        message:
          'Este campo de configuración está controlado por el archivo .env y no se puede cambiar aquí.',
      });
    }
  }

  const success = await appConfig.set({ oauth: form.data });

  if (!success) {
    form.message = { type: 'error', text: 'Error al editar la configuración OAuth' };
    return actionResult('failure', { form });
  }

  form.message = { type: 'success', text: 'Configuración OAuth actualizada' };

  return actionResult('success', { form });
};
