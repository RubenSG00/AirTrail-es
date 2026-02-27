import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { apiError, unauthorized, validateApiKey } from '$lib/server/utils/api';
import { getFlight } from '$lib/server/utils/flight';

export const GET: RequestHandler = async ({ request, params }) => {
  const user = await validateApiKey(request);
  if (!user) {
    return unauthorized();
  }

  const id = +params.id;
  if (isNaN(id)) {
    return apiError('El id del vuelo no es un número', 400);
  }

  const flight = await getFlight(id);
  if (!flight?.seats.some((seat) => seat.userId === user.id)) {
    return apiError(
      'Vuelo no encontrado o no tienes un asiento en este vuelo',
      403,
    );
  }

  return json({ success: true, flight });
};
