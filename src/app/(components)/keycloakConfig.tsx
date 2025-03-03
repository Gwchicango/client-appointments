import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://172.172.141.223:8040", // URL de Keycloak
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "CimedRealm", // Nombre del realm
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "CimedClient", // ID del cliente
  clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET || "LX3PKkMRtPaE0c6oXoAdvm3w1H1PJiAI", // Client secret
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;