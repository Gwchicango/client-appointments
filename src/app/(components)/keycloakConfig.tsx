import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://172.172.141.223:8040", // URL de Keycloak
  realm: "CimedRealm", // Nombre del realm
  clientId: "CimedClient", // ID del cliente
  clientSecret: "LX3PKkMRtPaE0c6oXoAdvm3w1H1PJiAI", // Client secret
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;