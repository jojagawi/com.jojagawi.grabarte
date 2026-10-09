import { executeAthenaQuery } from "@/lib/rates-athena.server";

// Solicitudes de /contacto que guarda la Lambda de contacto en s3://<dam>/contact/requests/<id>.json.
export type ContactRequestItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  productType: string;
  requestedProduct: string;
  quantity: string;
  neededBy: string;
  details: string;
  pageUrl: string;
  urgent: boolean;
  attachments: string[];
  createdAt: string;
  status: number;
  source: string;
};

function getContactsTableName() {
  const database = process.env.NEXT_AWS_ATHENA_RATES_DATABASE || "inspiraarte_rates";
  const table = process.env.NEXT_AWS_ATHENA_CONTACTS_TABLE || "contacts";
  return `${database}.${table}`;
}

function toFieldValue(value: string | undefined) {
  return String(value ?? "").trim();
}

export async function getLatestContactsFromAthena(limit = 150): Promise<ContactRequestItem[]> {
  // Los arreglos llegan como texto; se unen con un separador que no aparece en llaves de S3.
  const query = [
    "SELECT id, name, email, phone, occasion, producttype, requestedproduct, quantity, neededby, details,",
    "pageurl, coalesce(urgent, false) AS urgent, array_join(coalesce(attachments, CAST(ARRAY[] AS array(varchar))), '|') AS attachments,",
    "createdat, coalesce(status, 0) AS status, source",
    `FROM ${getContactsTableName()}`,
    "ORDER BY from_iso8601_timestamp(createdat) DESC",
    `LIMIT ${Math.max(1, Math.min(500, Math.floor(limit)))}`,
  ].join(" ");

  const rows = await executeAthenaQuery(query);

  return rows.map((row) => {
    const cols = (row.Data ?? []).map((cell) => toFieldValue(cell?.VarCharValue));
    return {
      id: cols[0],
      name: cols[1],
      email: cols[2],
      phone: cols[3],
      occasion: cols[4],
      productType: cols[5],
      requestedProduct: cols[6],
      quantity: cols[7],
      neededBy: cols[8],
      details: cols[9],
      pageUrl: cols[10],
      urgent: cols[11].toLowerCase() === "true",
      attachments: cols[12] ? cols[12].split("|").filter(Boolean) : [],
      createdAt: cols[13],
      status: Number(cols[14]) || 0,
      source: cols[15],
    };
  });
}
