import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  org?: number;
  [key: string]: unknown;
}

/**
 * Obtiene el token de autenticación desde localStorage.
 * @returns {string | null} El token de autenticación o null si no se encuentra.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
  
};

/**
 * Decodifica el token JWT.
 * @param token - El token JWT a decodificar.
 * @returns {DecodedToken | null} Los datos decodificados del token.
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Obtiene el ID de la organización desde el token JWT almacenado en localStorage.
 * @returns {number | null} El ID de la organización o null si no se encuentra.
 */
export const getOrganizationId = (): number | null => {
  const token = getToken();
  if (token) {
    const decodedToken = decodeToken(token);
    return decodedToken?.org || null;
  }
  return null;
};