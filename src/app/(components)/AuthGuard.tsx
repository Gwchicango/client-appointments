import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import keycloak from "./keycloakConfig";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
      keycloak.init({ onLoad: "check-sso" }).then((authenticated) => {
        if (!authenticated) {
          router.push("/auth/login");
        } else {
          setIsAuthenticated(true);
        }
      }).catch((error) => {
        console.error("Error al inicializar Keycloak:", error);
        router.push("/auth/login");
      });
    }
  }, [router.isReady]);

  if (!isRouterReady || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}