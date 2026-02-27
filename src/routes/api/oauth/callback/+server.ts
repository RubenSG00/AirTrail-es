import { error, json } from '@sveltejs/kit';
import { generateId } from 'lucia';
import type { UserInfoResponse } from 'openid-client';
import { z } from 'zod';

import type { RequestHandler } from './$types';

import { db, type User } from '$lib/db';
import { lucia } from '$lib/server/auth';
import { createSession } from '$lib/server/utils/auth';
import { appConfig } from '$lib/server/utils/config';
import { getOAuthProfile } from '$lib/server/utils/oauth';

const CallbackSchema = z.object({
  url: z.string().url(),
});

export const POST: RequestHandler = async ({ cookies, request, locals }) => {
  const body = await request.json();
  const parsed = CallbackSchema.safeParse(body);
  if (!parsed.success) {
    return error(500, parsed.error.toString());
  }

  const { url } = parsed.data;
  const config = await appConfig.get();
  if (!config) {
    return error(500, 'Error al cargar la configuración');
  }

  let profile: UserInfoResponse;
  try {
    profile = await getOAuthProfile(url);
  } catch (e) {
    console.error(e);
    return error(500, 'Estado no válido, por favor inténtalo de nuevo');
  }

  const { autoRegister } = config.oauth;

  let user: User | undefined = locals.user ?? undefined;

  // Case 1: User is already logged in (user triggered account linking)
  if (user) {
    if (user.oauthId) {
      return error(500, 'El usuario ya está vinculado a una cuenta');
    }

    const existingUser = await db
      .selectFrom('user')
      .selectAll()
      .where('oauthId', '=', profile.sub)
      .executeTakeFirst();
    if (existingUser) {
      return error(500, 'La cuenta ya está vinculada a otro usuario');
    }

    user = await db
      .updateTable('user')
      .set('oauthId', profile.sub)
      .where('id', '=', user.id)
      .returningAll()
      .executeTakeFirst();
  }

  // Case 2: User is not logged in (user is logging in via OAuth)
  if (!user) {
    user = await db
      .selectFrom('user')
      .selectAll()
      .where('oauthId', '=', profile.sub)
      .executeTakeFirst();
  }

  // Case 3: User has not logged in via OAuth before, but has an account (we assume the username is owned by the user)
  if (!user && profile.preferred_username) {
    const usernameUser = await db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', profile.preferred_username)
      .executeTakeFirst();
    if (usernameUser) {
      if (usernameUser.oauthId) {
        throw new Error(
          'El nombre de usuario ya está en uso y está vinculado a otra cuenta',
        );
      }
      user = await db
        .updateTable('user')
        .set('oauthId', profile.sub)
        .where('id', '=', usernameUser.id)
        .returningAll()
        .executeTakeFirst();
    }
  }

  // Case 4: User has not logged in via OAuth before, and does not have an account
  if (!user) {
    if (!autoRegister) {
      return error(500, 'No tienes una cuenta de AirTrail');
    }

    if (!profile.preferred_username) {
      return error(500, 'Nombre de usuario no proporcionado');
    }

    const displayName =
      profile.name ??
      `${profile.given_name || ''} ${profile.family_name || ''}`;
    user = await db
      .insertInto('user')
      .values({
        id: generateId(15),
        username: profile.preferred_username,
        displayName,
        oauthId: profile.sub,
        unit: 'metric',
        role: 'user',
      })
      .returningAll()
      .executeTakeFirst();
  }

  if (!user) {
    return error(500, 'Error al crear usuario');
  }

  await createSession(lucia, user.id, cookies);
  return json({ success: true });
};
