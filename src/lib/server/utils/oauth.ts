import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  discovery,
  fetchUserInfo,
  randomState,
} from 'openid-client';

import { appConfig } from '$lib/server/utils/config';

export const getAuthorizeUrl = async (redirectUrl: string) => {
  const config = await appConfig.get();
  if (!config) {
    throw new Error('Error al cargar la configuración');
  }
  const scope = config.oauth.scope;

  const parameters: Record<string, string> = {
    redirect_uri: redirectUrl,
    scope,
    state: randomState(),
  };

  const client = await getOAuthClient();
  const redirectTo: URL = buildAuthorizationUrl(client, parameters);
  return redirectTo.href;
};

export const getOAuthProfile = async (currentUrl: string) => {
  let url: URL;
  try {
    url = new URL(currentUrl);
  } catch {
    throw new Error('URL no válida');
  }

  const client = await getOAuthClient();
  const tokens = await authorizationCodeGrant(client, url, {
    expectedState: url.searchParams.get('state') || undefined,
  });
  const claims = tokens.claims();
  if (!claims) {
    throw new Error('Error al obtener información del usuario');
  }

  return await fetchUserInfo(client, tokens.access_token, claims.sub);
};

export const getOAuthClient = async () => {
  const config = await appConfig.get();
  if (!config) {
    throw new Error('Error al cargar la configuración');
  }

  const { enabled, clientId, clientSecret, issuerUrl } = config.oauth;
  if (!enabled || !clientId || !clientSecret || !issuerUrl) {
    throw new Error('OAuth no está habilitado o no está configurado correctamente');
  }

  try {
    return await discovery(new URL(issuerUrl), clientId, clientSecret);
  } catch {
    throw new Error('Error al descubrir el emisor');
  }
};
