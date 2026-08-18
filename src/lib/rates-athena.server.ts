import {
  AthenaClient,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  QueryExecutionState,
  StartQueryExecutionCommand,
} from "@aws-sdk/client-athena";

export type SiteRateItem = {
  id: string;
  name: string;
  product: string;
  description: string;
  rating: number;
  createdAt: string;
  source: string;
};

const POLL_INTERVAL_MS = 750;
const MAX_POLL_ATTEMPTS = 30;

type AthenaRow = {
  Data?: Array<{ VarCharValue?: string }>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseNumber(value: string | undefined) {
  const parsed = Number(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function toFieldValue(value: string | undefined) {
  return String(value ?? "").trim();
}

function createAthenaClient() {
  const region = process.env.NEXT_AWS_REGION;
  const accessKeyId = process.env.NEXT_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing NEXT_AWS_* credentials for Athena queries.");
  }

  return new AthenaClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function getLatestRatesFromAthena(limit = 100): Promise<SiteRateItem[]> {
  const client = createAthenaClient();

  const workGroup = process.env.NEXT_AWS_ATHENA_WORKGROUP || "inspiraarte-prod-rates";
  const database = process.env.NEXT_AWS_ATHENA_RATES_DATABASE || "inspiraarte_rates";
  const table = process.env.NEXT_AWS_ATHENA_RATES_TABLE || "rates";

  const query = [
    "SELECT id, name, product, description, rating, createdat, source",
    `FROM ${database}.${table}`,
    "ORDER BY from_iso8601_timestamp(createdat) DESC",
    `LIMIT ${Math.max(1, Math.min(500, Math.floor(limit)))}`,
  ].join(" ");

  const startResponse = await client.send(
    new StartQueryExecutionCommand({
      WorkGroup: workGroup,
      QueryString: query,
    }),
  );

  const queryExecutionId = startResponse.QueryExecutionId;
  if (!queryExecutionId) {
    throw new Error("Athena did not return a QueryExecutionId.");
  }

  let queryState: QueryExecutionState | undefined;

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const executionResponse = await client.send(
      new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId }),
    );

    queryState = executionResponse.QueryExecution?.Status?.State;

    if (queryState === QueryExecutionState.SUCCEEDED) {
      break;
    }

    if (
      queryState === QueryExecutionState.FAILED ||
      queryState === QueryExecutionState.CANCELLED
    ) {
      const reason =
        executionResponse.QueryExecution?.Status?.StateChangeReason ||
        "Athena query failed.";
      throw new Error(reason);
    }

    await wait(POLL_INTERVAL_MS);
  }

  if (queryState !== QueryExecutionState.SUCCEEDED) {
    throw new Error("Athena query timeout.");
  }

  const resultsResponse = await client.send(
    new GetQueryResultsCommand({ QueryExecutionId: queryExecutionId }),
  );

  const rows = resultsResponse.ResultSet?.Rows ?? [];
  const dataRows = rows.slice(1) as AthenaRow[];

  return dataRows.map((row) => {
    const cols = row.Data ?? [];

    return {
      id: toFieldValue(cols[0]?.VarCharValue),
      name: toFieldValue(cols[1]?.VarCharValue),
      product: toFieldValue(cols[2]?.VarCharValue),
      description: toFieldValue(cols[3]?.VarCharValue),
      rating: parseNumber(cols[4]?.VarCharValue),
      createdAt: toFieldValue(cols[5]?.VarCharValue),
      source: toFieldValue(cols[6]?.VarCharValue),
    };
  });
}


