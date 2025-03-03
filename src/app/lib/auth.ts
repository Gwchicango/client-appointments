import keycloak from "@/app/(components)/keycloakConfig";

export function getToken() {
  return keycloak.token;
}

export function logout() {
  keycloak.logout();
}