import { buildHomeLinkHeader } from "@/lib/public-api";

// Pone la cabecera Link de descubrimiento (RFC 8288, RFC 9727 §3) en la home. El sitio es un
// export estático en un bucket S3 website, que no permite cabeceras propias, así que la añade
// una regla de modificación de cabeceras de respuesta (Transform Rule) de Cloudflare.
// Es idempotente: crea o actualiza solo la regla con REF y deja las demás reglas de la zona.
//
//   CF_TOKEN=... [CF_ZONE_ID=...] pnpm run cloudflare:link-headers
//
// El token necesita el permiso "Zone > Transform Rules > Edit" (además del de purga de caché).

const API = "https://api.cloudflare.com/client/v4";
const PHASE = "http_response_headers_transform";
const REF = "inspiraarte_home_link_headers";
const ZONE_NAME = "inspiraarte.com";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.inspiraarte.com").replace(/\/+$/u, "");
const token = process.env.CF_TOKEN?.trim();

type CloudflareResponse<T> = {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  result: T;
};

type Rule = { id?: string; ref?: string };
type Ruleset = { id: string; rules?: Rule[] };

async function cloudflare<T>(method: string, path: string, body?: unknown): Promise<{ status: number; data: CloudflareResponse<T> }> {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: (await response.json()) as CloudflareResponse<T> };
}

function assertSuccess<T>(label: string, { status, data }: { status: number; data: CloudflareResponse<T> }): T {
  if (!data.success) {
    throw new Error(`${label} (HTTP ${status}): ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}

async function getZoneId(): Promise<string> {
  const configured = process.env.CF_ZONE_ID?.trim();
  if (configured) {
    return configured;
  }
  const zones = assertSuccess("Buscar la zona", await cloudflare<Array<{ id: string }>>("GET", `/zones?name=${ZONE_NAME}`));
  if (!zones[0]) {
    throw new Error(`No se encontró la zona ${ZONE_NAME}.`);
  }
  return zones[0].id;
}

function buildRule() {
  const host = new URL(siteUrl).host;
  const hosts = [...new Set([host, host.replace(/^www\./u, "")])].map((value) => `"${value}"`).join(" ");
  return {
    ref: REF,
    description: "Cabecera Link de descubrimiento para agentes en la home (RFC 8288, RFC 9727)",
    expression: `(http.host in {${hosts}} and http.request.uri.path eq "/")`,
    action: "rewrite",
    action_parameters: {
      headers: {
        Link: { operation: "set", value: buildHomeLinkHeader(siteUrl) },
      },
    },
    enabled: true,
  };
}

async function main(): Promise<void> {
  if (!token) {
    console.warn("cloudflare:link-headers: falta CF_TOKEN; no se cambió nada.");
    return;
  }

  const zoneId = await getZoneId();
  const rule = buildRule();
  const entrypointPath = `/zones/${zoneId}/rulesets/phases/${PHASE}/entrypoint`;
  const entrypoint = await cloudflare<Ruleset>("GET", entrypointPath);

  // Sin reglas de esta fase todavía: se crea el ruleset con la nuestra.
  if (entrypoint.status === 404) {
    assertSuccess("Crear el ruleset", await cloudflare<Ruleset>("PUT", entrypointPath, { rules: [rule] }));
    console.log("cloudflare:link-headers: regla creada.");
    return;
  }

  const ruleset = assertSuccess("Leer el ruleset", entrypoint);
  const existing = ruleset.rules?.find((item) => item.ref === REF);
  const rulesPath = `/zones/${zoneId}/rulesets/${ruleset.id}/rules`;

  if (existing?.id) {
    assertSuccess("Actualizar la regla", await cloudflare<Ruleset>("PATCH", `${rulesPath}/${existing.id}`, rule));
    console.log("cloudflare:link-headers: regla actualizada.");
  } else {
    assertSuccess("Agregar la regla", await cloudflare<Ruleset>("POST", rulesPath, rule));
    console.log("cloudflare:link-headers: regla agregada.");
  }
}

main().catch((error) => {
  console.error(`cloudflare:link-headers: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
