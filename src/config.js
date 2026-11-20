const ENVIRONNEMENTS = ["development", "production", "test"];

// Lit et valide la configuration. Lance une Error au message clair si une valeur est invalide.
export function loadConfig(env = process.env) {
  const portBrut = env.PORT ?? "4000";
  if (!/^\d+$/.test(portBrut) || Number(portBrut) < 1 || Number(portBrut) > 65535) {
    throw new Error(`PORT invalide : "${portBrut}" (entier de 1 à 65535 attendu).`);
  }

  const nodeEnv = env.NODE_ENV ?? "development";
  if (!ENVIRONNEMENTS.includes(nodeEnv)) {
    throw new Error(`NODE_ENV invalide : "${nodeEnv}" (${ENVIRONNEMENTS.join(", ")} attendu).`);
  }

  return { port: Number(portBrut), nodeEnv };
}