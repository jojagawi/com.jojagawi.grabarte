import { rm } from "node:fs/promises";
import { join } from "node:path";

type InvalidateAssetCachesInput = {
  requestUrl: string;
  objectKeys?: string[];
  fileIds?: number[];
  flushViteCache?: boolean;
};

type InvalidateAssetCachesResult = {
  cloudflarePurged: boolean;
  cloudflarePurgedCount: number;
  viteCacheFlushed: boolean;
  viteCacheDirsChecked: string[];
  errors: string[];
};

function buildPublicAssetUrl(objectKey: string): string | null {
  const host = process.env.NEXT_PUBLIC_S3;
  if (!host) {
    return null;
  }

  const protocol = process.env.NEXT_PUBLIC_S3_PROTOCOL || "http";
  const normalizedPath = objectKey.replace(/^\/+/, "");

  return `${protocol}://${host}/${normalizedPath}`;
}

function buildPrivateProxyUrl(requestUrl: string, fileId: number): string | null {
  if (!Number.isInteger(fileId) || fileId <= 0) {
    return null;
  }

  try {
    const origin = new URL(requestUrl).origin;
    return `${origin}/api/admin/designs/files/${fileId}`;
  } catch {
    return null;
  }
}

async function purgeCloudflareUrls(urls: string[]): Promise<{ purged: boolean; count: number; error?: string }> {
  const token = process.env.NEXT_CLOUDFLARE_TOKEN;
  const zoneId = process.env.NEXT_CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId || urls.length === 0) {
    return { purged: false, count: 0 };
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: urls }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; errors?: Array<{ message?: string }> }
      | null;

    if (!response.ok || !payload?.success) {
      const errorMessage = payload?.errors?.map((item) => item.message).filter(Boolean).join("; ");
      return {
        purged: false,
        count: 0,
        error: errorMessage || `Cloudflare purge fallo con status ${response.status}`,
      };
    }

    return { purged: true, count: urls.length };
  } catch (error) {
    return {
      purged: false,
      count: 0,
      error: error instanceof Error ? error.message : "Error desconocido al purgar Cloudflare",
    };
  }
}

async function flushViteCache(): Promise<{ flushed: boolean; checkedDirs: string[]; error?: string }> {
  const cacheDirs = [
    join(process.cwd(), ".vite"),
    join(process.cwd(), "node_modules", ".vite"),
    join(process.cwd(), "node_modules", ".cache", "vite"),
  ];

  try {
    await Promise.all(cacheDirs.map((directory) => rm(directory, { recursive: true, force: true })));
    return { flushed: true, checkedDirs: cacheDirs };
  } catch (error) {
    return {
      flushed: false,
      checkedDirs: cacheDirs,
      error: error instanceof Error ? error.message : "Error desconocido al limpiar cache de vite",
    };
  }
}

export async function invalidateAssetCaches(
  input: InvalidateAssetCachesInput,
): Promise<InvalidateAssetCachesResult> {
  const objectKeyUrls = (input.objectKeys || [])
    .map((objectKey) => objectKey.trim())
    .filter(Boolean)
    .map((objectKey) => buildPublicAssetUrl(objectKey))
    .filter((url): url is string => Boolean(url));

  const privateProxyUrls = (input.fileIds || [])
    .map((fileId) => buildPrivateProxyUrl(input.requestUrl, fileId))
    .filter((url): url is string => Boolean(url));

  const urlsToPurge = Array.from(new Set([...objectKeyUrls, ...privateProxyUrls]));
  const errors: string[] = [];

  const cloudflareResult = await purgeCloudflareUrls(urlsToPurge);
  if (cloudflareResult.error) {
    errors.push(cloudflareResult.error);
  }

  const shouldFlushVite = input.flushViteCache !== false;
  let viteResult = { flushed: false, checkedDirs: [] as string[] };

  if (shouldFlushVite) {
    const flushResult = await flushViteCache();
    viteResult = {
      flushed: flushResult.flushed,
      checkedDirs: flushResult.checkedDirs,
    };

    if (flushResult.error) {
      errors.push(flushResult.error);
    }
  }

  return {
    cloudflarePurged: cloudflareResult.purged,
    cloudflarePurgedCount: cloudflareResult.count,
    viteCacheFlushed: viteResult.flushed,
    viteCacheDirsChecked: viteResult.checkedDirs,
    errors,
  };
}

