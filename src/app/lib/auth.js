import keycloak from "./keycloakConfig";

export function getToken() {
  return keycloak.token;
}

export function logout() {
  keycloak.logout();
}